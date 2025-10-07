import { Request, Response } from "express";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import Review from "@/models/Review";
import ApiError from "@/utils/ApiError";
import { APP_CONSTANTS } from "@/config/constants";

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      totalRevenue,
      previousMonthRevenue,
      totalOrders,
      previousMonthOrders,
      totalProducts,
      activeProducts,
      totalCustomers,
      previousMonthCustomers,
      pendingOrders,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      // Current month revenue
      Order.aggregate([
        {
          $match: {
            "payment.status": "completed",
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      // Previous month revenue
      Order.aggregate([
        {
          $match: {
            "payment.status": "completed",
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      // Total orders this month
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      // Previous month orders
      Order.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
      // Products count
      Product.countDocuments({ deletedAt: null }),
      Product.countDocuments({ status: "active", isPublished: true }),
      // Customers this month
      User.countDocuments({
        role: "customer",
        createdAt: { $gte: thirtyDaysAgo },
      }),
      // Previous month customers
      User.countDocuments({
        role: "customer",
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
      // Pending orders
      Order.countDocuments({ status: "pending" }),
      // Low stock products
      Product.countDocuments({
        totalStock: { $lt: 10 },
        status: "active",
        deletedAt: null,
      }),
      // Recent orders
      Order.find()
        .populate("customer", "firstName lastName email")
        .sort("-createdAt")
        .limit(10)
        .lean(),
    ]);

    // Calculate percentage changes
    const currentRevenue = totalRevenue[0]?.total || 0;
    const prevRevenue = previousMonthRevenue[0]?.total || 0;
    const revenueChange =
      prevRevenue > 0
        ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100)
        : 0;

    const ordersChange =
      previousMonthOrders > 0
        ? Math.round(
            ((totalOrders - previousMonthOrders) / previousMonthOrders) * 100
          )
        : 0;

    const customersChange =
      previousMonthCustomers > 0
        ? Math.round(
            ((totalCustomers - previousMonthCustomers) /
              previousMonthCustomers) *
              100
          )
        : 0;

    return ApiResponse.ok(res, "Admin stats retrieved", {
      revenue: {
        current: currentRevenue,
        change: revenueChange,
      },
      orders: {
        current: totalOrders,
        change: ordersChange,
        pending: pendingOrders,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
      },
      customers: {
        current: totalCustomers,
        change: customersChange,
      },
      recentOrders,
    });
  }
);

// @desc    Get low stock products
// @route   GET /api/v1/admin/low-stock
// @access  Private/Admin
export const getLowStockProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await Product.find({
      totalStock: { $lt: 10 },
      status: "active",
      deletedAt: null,
    })
      .populate("category", "name")
      .sort("totalStock")
      .limit(20)
      .lean();

    return ApiResponse.ok(res, "Low stock products retrieved", { products });
  }
);

// @desc    Get all reviews (admin)
// @route   GET /api/v1/admin/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = APP_CONSTANTS.DEFAULT_PAGE,
      limit = APP_CONSTANTS.DEFAULT_LIMIT,
      sort = "-createdAt",
      isPublished,
      rating,
    } = req.query;

    const query: any = {};

    if (isPublished !== undefined) {
      query.isPublished = isPublished === "true";
    }

    if (rating) {
      query.rating = Number(rating);
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(
      parseInt(limit as string, 10),
      APP_CONSTANTS.MAX_LIMIT
    );
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("customer", "firstName lastName avatar")
        .populate("product", "name slug featuredImage")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments(query),
    ]);

    return ApiResponse.success(
      res,
      200,
      "Reviews retrieved successfully",
      reviews,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      }
    );
  }
);

// @desc    Update review publish status
// @route   PATCH /api/v1/admin/reviews/:id/publish
// @access  Private/Admin
export const updateReviewPublishStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { isPublished } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isPublished },
      { new: true }
    )
      .populate("customer", "firstName lastName avatar")
      .populate("product", "name slug featuredImage");

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    return ApiResponse.ok(res, "Review status updated", { review });
  }
);

// @desc    Get all staff members
// @route   GET /api/v1/admin/staff
// @access  Private/Admin
export const getAllStaff = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = APP_CONSTANTS.DEFAULT_PAGE,
    limit = APP_CONSTANTS.DEFAULT_LIMIT,
    isActive,
  } = req.query;

  const query: any = { role: { $in: ["admin", "staff"] } };

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = Math.min(
    parseInt(limit as string, 10),
    APP_CONSTANTS.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  const [staff, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  return ApiResponse.success(
    res,
    200,
    "Staff members retrieved successfully",
    staff,
    {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    }
  );
});

// @desc    Create staff member
// @route   POST /api/v1/admin/staff
// @access  Private/Admin
export const createStaff = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("Email already exists");
  }

  // Validate role
  if (!["admin", "staff"].includes(role)) {
    throw ApiError.badRequest("Invalid role. Must be 'admin' or 'staff'");
  }

  // Create staff member
  const staff = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    isEmailVerified: true,
    isActive: true,
  });

  const { password: _, ...staffResponse } = staff.toObject();

  return ApiResponse.created(
    res,
    "Staff member created successfully",
    staffResponse
  );
});

// @desc    Update staff member
// @route   PATCH /api/v1/admin/staff/:id
// @access  Private/Admin
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, role, isActive } = req.body;

  const staff = await User.findById(req.params.id);

  if (!staff) {
    throw ApiError.notFound("Staff member not found");
  }

  // Prevent changing role if not admin/staff
  if (role && !["admin", "staff"].includes(role)) {
    throw ApiError.badRequest("Invalid role");
  }

  // Update fields
  if (firstName) staff.firstName = firstName;
  if (lastName) staff.lastName = lastName;
  if (email) staff.email = email;
  if (phone) staff.phone = phone;
  if (role) staff.role = role;
  if (isActive !== undefined) staff.isActive = isActive;

  await staff.save();

  const { password: _, ...staffResponse } = staff.toObject();

  return ApiResponse.ok(
    res,
    "Staff member updated successfully",
    staffResponse
  );
});

// @desc    Delete staff member
// @route   DELETE /api/v1/admin/staff/:id
// @access  Private/Admin
export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await User.findById(req.params.id);

  if (!staff) {
    throw ApiError.notFound("Staff member not found");
  }

  // Prevent deleting the last admin
  if (staff.role === ("admin" as any)) {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw ApiError.badRequest("Cannot delete the last admin");
    }
  }

  // Soft delete by deactivating
  staff.isActive = false;
  await staff.save();

  return ApiResponse.ok(res, "Staff member deactivated successfully");
});

// @desc    Get product analytics
// @route   GET /api/v1/admin/products/:id/analytics
// @access  Private/Admin
export const getProductAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get all completed orders containing this product
    const orders = await Order.find({
      "items.product": id,
      "payment.status": "completed",
    }).lean();

    // Calculate analytics
    let totalRevenue = 0;
    let totalQuantitySold = 0;
    const variantSales = new Map<
      string,
      { quantity: number; revenue: number }
    >();
    const monthlyRevenue = new Map<
      string,
      { revenue: number; orders: number }
    >();

    orders.forEach((order: any) => {
      const monthKey = new Date(order.createdAt).toISOString().slice(0, 7); // YYYY-MM

      order.items.forEach((item: any) => {
        if (item.product.toString() === id) {
          const itemTotal = item.price * item.quantity;
          totalRevenue += itemTotal;
          totalQuantitySold += item.quantity;

          // Track variant sales
          const variantKey = item.color || "default";
          const existing = variantSales.get(variantKey) || {
            quantity: 0,
            revenue: 0,
          };
          variantSales.set(variantKey, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + itemTotal,
          });

          // Track monthly revenue
          const monthData = monthlyRevenue.get(monthKey) || {
            revenue: 0,
            orders: 0,
          };
          monthlyRevenue.set(monthKey, {
            revenue: monthData.revenue + itemTotal,
            orders: monthData.orders + 1,
          });
        }
      });
    });

    // Format top variants
    const topVariants = Array.from(variantSales.entries())
      .map(([color, data]) => ({
        color,
        quantitySold: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Format monthly revenue
    const revenueByMonth = Array.from(monthlyRevenue.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    const analytics = {
      totalOrders: orders.length,
      totalRevenue,
      totalQuantitySold,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      revenueByMonth,
      topVariants,
    };

    return ApiResponse.ok(res, "Product analytics retrieved", analytics);
  }
);
