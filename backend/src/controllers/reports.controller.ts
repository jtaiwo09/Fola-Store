// backend/src/controllers/reports.controller.ts
import { Request, Response } from "express";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";

// @desc    Get sales report
// @route   GET /api/v1/admin/reports/sales
// @access  Private/Admin
export const getSalesReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const end = endDate ? new Date(endDate as string) : new Date();

    // Revenue over time
    const revenueOverTime = await Order.aggregate([
      {
        $match: {
          "payment.status": "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format:
                groupBy === "month"
                  ? "%Y-%m"
                  : groupBy === "week"
                    ? "%Y-W%V"
                    : "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
          averageOrderValue: { $avg: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top products by revenue (product-agnostic)
    const topProducts = await Order.aggregate([
      {
        $match: {
          "payment.status": "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          quantitySold: { $sum: "$items.quantity" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          productName: "$product.name",
          productType: "$product.productType",
          revenue: 1,
          quantitySold: 1,
          orders: 1,
        },
      },
    ]);

    // Sales by category (works for any category structure)
    const salesByCategory = await Order.aggregate([
      {
        $match: {
          "payment.status": "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.name" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $sum: 1 },
          quantitySold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Sales by product type (fabric, readymade, accessory, etc.)
    const salesByProductType = await Order.aggregate([
      {
        $match: {
          "payment.status": "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.productType",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $sum: 1 },
          quantitySold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Overall metrics
    const totalOrders = await Order.countDocuments({
      "payment.status": "completed",
      createdAt: { $gte: start, $lte: end },
    });

    const totalRevenue = revenueOverTime.reduce(
      (sum, item) => sum + item.revenue,
      0
    );

    return ApiResponse.ok(res, "Sales report generated", {
      dateRange: { startDate: start, endDate: end },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
      revenueOverTime,
      topProducts,
      salesByCategory,
      salesByProductType,
    });
  }
);

// @desc    Get inventory report
// @route   GET /api/v1/admin/reports/inventory
// @access  Private/Admin
export const getInventoryReport = asyncHandler(
  async (_req: Request, res: Response) => {
    // Low stock products
    const lowStockProducts = await Product.find({
      totalStock: { $lt: 10 },
      status: "active",
      isPublished: true,
      deletedAt: null,
    })
      .populate("category", "name")
      .sort("totalStock")
      .limit(20)
      .lean();

    // Out of stock products
    const outOfStockProducts = await Product.find({
      totalStock: 0,
      status: "active",
      deletedAt: null,
    })
      .populate("category", "name")
      .sort("-createdAt")
      .limit(20)
      .lean();

    // Stock value by category (works for all product types)
    const stockValueByCategory = await Product.aggregate([
      { $match: { deletedAt: null, status: "active" } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.name" },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$totalStock" },
          stockValue: {
            $sum: {
              $multiply: [
                "$totalStock",
                { $ifNull: ["$salePrice", "$basePrice"] },
              ],
            },
          },
        },
      },
      { $sort: { stockValue: -1 } },
    ]);

    // Stock value by product type
    const stockValueByProductType = await Product.aggregate([
      { $match: { deletedAt: null, status: "active" } },
      {
        $group: {
          _id: "$productType",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$totalStock" },
          stockValue: {
            $sum: {
              $multiply: [
                "$totalStock",
                { $ifNull: ["$salePrice", "$basePrice"] },
              ],
            },
          },
        },
      },
      { $sort: { stockValue: -1 } },
    ]);

    // Overall inventory metrics
    const inventoryStats = await Product.aggregate([
      { $match: { deletedAt: null, status: "active" } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$totalStock" },
          totalValue: {
            $sum: {
              $multiply: [
                "$totalStock",
                { $ifNull: ["$salePrice", "$basePrice"] },
              ],
            },
          },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ["$totalStock", 10] }, 1, 0] },
          },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ["$totalStock", 0] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = inventoryStats[0] || {
      totalProducts: 0,
      totalStock: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
    };

    return ApiResponse.ok(res, "Inventory report generated", {
      summary: stats,
      lowStockProducts,
      outOfStockProducts,
      stockValueByCategory,
      stockValueByProductType,
    });
  }
);

// @desc    Get product performance report
// @route   GET /api/v1/admin/reports/product-performance
// @access  Private/Admin
export const getProductPerformanceReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate, limit = 20 } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Best sellers
    const bestSellers = await Order.aggregate([
      {
        $match: {
          "payment.status": "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: parseInt(limit as string) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          productName: "$product.name",
          productType: "$product.productType",
          quantitySold: 1,
          revenue: 1,
          orders: 1,
          averageRating: "$product.averageRating",
          reviewCount: "$product.reviewCount",
        },
      },
    ]);

    // Worst performers (low sales, active products)
    const worstPerformers = await Order.aggregate([
      {
        $match: {
          "payment.status": "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { quantitySold: 1 } },
      { $limit: parseInt(limit as string) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $match: {
          "product.status": "active",
          "product.isPublished": true,
        },
      },
      {
        $project: {
          productId: "$_id",
          productName: "$product.name",
          productType: "$product.productType",
          quantitySold: 1,
          revenue: 1,
        },
      },
    ]);

    return ApiResponse.ok(res, "Product performance report generated", {
      dateRange: { startDate: start, endDate: end },
      bestSellers,
      worstPerformers,
    });
  }
);
