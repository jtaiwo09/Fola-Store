import { Request, Response } from "express";
import Product from "@/models/Product";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import {
  APP_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@/config/constants";
import { notifyLowStock } from "@/services/notification.service";
import { Types } from "mongoose";

const checkAndNotifyLowStock = async (productId: Types.ObjectId) => {
  const product = await Product.findById(productId);

  if (!product || !product.trackInventory) return;

  const threshold = product.lowStockThreshold || 10;
  const wasLowStock = product.totalStock <= threshold && product.totalStock > 0;

  if (wasLowStock) {
    await notifyLowStock(product);
  }
};

// @desc    Get all products with filters, pagination, and sorting
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = APP_CONSTANTS.DEFAULT_PAGE,
      limit = APP_CONSTANTS.DEFAULT_LIMIT,
      sort = "-createdAt",
      category,
      fabricType,
      minPrice,
      maxPrice,
      search,
      status = "active",
      isPublished = true,
    } = req.query;

    // Build query
    const query: any = {
      status,
      isPublished,
      deletedAt: null,
    };

    if (category) query.category = category;
    if (fabricType) query.fabricType = fabricType;

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(
      parseInt(limit as string, 10),
      APP_CONSTANTS.MAX_LIMIT
    );
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    return ApiResponse.success(
      res,
      200,
      "Products retrieved successfully",
      products,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      }
    );
  }
);

// @desc    Get product by ID
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      throw ApiError.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return ApiResponse.ok(res, "Product retrieved successfully", { product });
  }
);

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      throw ApiError.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return ApiResponse.ok(res, "Product retrieved successfully", { product });
  }
);

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.create(req.body);

    // Check if product is low on stock after creation
    await checkAndNotifyLowStock(product._id);

    return ApiResponse.created(res, SUCCESS_MESSAGES.PRODUCT_CREATED, {
      product,
    });
  }
);

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw ApiError.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    // Check if product is low on stock after update
    await checkAndNotifyLowStock(product._id);

    return ApiResponse.ok(res, SUCCESS_MESSAGES.PRODUCT_UPDATED, { product });
  }
);

// @desc    Delete product (soft delete)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      throw ApiError.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return ApiResponse.ok(res, SUCCESS_MESSAGES.PRODUCT_DELETED);
  }
);

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isFeatured: true,
      isPublished: true,
      status: "active",
      deletedAt: null,
    })
      .populate("category", "name slug")
      .sort("-createdAt")
      .limit(parseInt(limit as string, 10))
      .lean();

    return ApiResponse.ok(res, "Featured products retrieved successfully", {
      products,
    });
  }
);

// @desc    Get new arrivals
// @route   GET /api/v1/products/new-arrivals
// @access  Public
export const getNewArrivals = asyncHandler(
  async (req: Request, res: Response) => {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isPublished: true,
      status: "active",
      deletedAt: null,
    })
      .populate("category", "name slug")
      .sort("-createdAt")
      .limit(parseInt(limit as string, 10))
      .lean();

    return ApiResponse.ok(res, "New arrivals retrieved successfully", {
      products,
    });
  }
);

// @desc    Check product stock availability
// @route   POST /api/v1/products/:id/check-stock
// @access  Public
export const checkStock = asyncHandler(async (req: Request, res: Response) => {
  const { color, quantity } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw ApiError.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
  }

  // Cast product to any or add type assertion
  const variant = (product as any).getVariantByColor(color);

  if (!variant) {
    throw ApiError.notFound(ERROR_MESSAGES.VARIANT_NOT_FOUND);
  }

  const isAvailable = variant.stock >= quantity;

  return ApiResponse.ok(res, "Stock checked successfully", {
    isAvailable,
    availableStock: variant.stock,
    requestedQuantity: quantity,
  });
});

// @desc    Bulk update products status
// @route   PATCH /api/v1/products/bulk/publish
// @access  Private/Admin
export const bulkPublishProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { productIds, isPublished } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw ApiError.badRequest("Product IDs are required");
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { isPublished } }
    );

    return ApiResponse.ok(res, "Products updated successfully", {
      updatedCount: result.modifiedCount,
    });
  }
);

// @desc    Bulk delete products
// @route   DELETE /api/v1/products/bulk
// @access  Private/Admin
export const bulkDeleteProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw ApiError.badRequest("Product IDs are required");
    }

    // Soft delete by setting deletedAt
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { deletedAt: new Date() } }
    );

    return ApiResponse.ok(res, "Products deleted successfully", {
      deletedCount: result.modifiedCount,
    });
  }
);

// @desc    Bulk update product status
// @route   PATCH /api/v1/products/bulk/status
// @access  Private/Admin
export const bulkUpdateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { productIds, status } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw ApiError.badRequest("Product IDs are required");
    }

    if (!["draft", "active", "archived"].includes(status)) {
      throw ApiError.badRequest("Invalid status");
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status } }
    );

    return ApiResponse.ok(res, "Product status updated successfully", {
      updatedCount: result.modifiedCount,
    });
  }
);

// @desc    Get dynamic filter options
// @route   GET /api/v1/products/filters/options
// @access  Public
export const getFilterOptions = asyncHandler(
  async (_req: Request, res: Response) => {
    // Get all active published products
    const products = await Product.find({
      status: "active",
      isPublished: true,
      deletedAt: null,
    })
      .select("variants fabricType basePrice salePrice")
      .lean();

    // Extract unique colors from variants
    const colorSet = new Set<string>();
    const colorHexMap = new Map<string, string>();

    products.forEach((product: any) => {
      product.variants?.forEach((variant: any) => {
        if (variant.color && variant.isAvailable) {
          colorSet.add(variant.color);
          colorHexMap.set(variant.color, variant.colorHex);
        }
      });
    });

    const colors = Array.from(colorSet).map((color) => ({
      name: color,
      hex: colorHexMap.get(color) || "#000000",
    }));

    // Extract unique fabric types
    const fabricTypes = [
      ...new Set(
        products
          .map((p: any) => p.fabricType)
          .filter((f): f is string => Boolean(f))
      ),
    ];

    // Calculate price range
    const prices = products.map((p: any) => p.salePrice || p.basePrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return ApiResponse.ok(res, "Filter options retrieved successfully", {
      colors,
      fabricTypes,
      priceRange: {
        min: Math.floor(minPrice / 1000) * 1000, // Round down to nearest 1000
        max: Math.ceil(maxPrice / 1000) * 1000, // Round up to nearest 1000
      },
    });
  }
);
