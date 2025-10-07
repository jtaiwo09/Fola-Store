import { Request, Response } from "express";
import Category from "@/models/Category";
import Product from "@/models/Product";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { ERROR_MESSAGES } from "@/config/constants";

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { isActive = true, parent } = req.query;

    const query: any = { isActive };
    if (parent !== undefined) {
      query.parent = parent === "null" ? null : parent;
    }

    const categories = await Category.find(query)
      .populate("parent", "name slug")
      .sort("order name")
      .lean();

    return ApiResponse.ok(res, "Categories retrieved successfully", {
      categories,
    });
  }
);

// @desc    Get category tree (hierarchical)
// @route   GET /api/v1/categories/tree
// @access  Public
export const getCategoryTree = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await Category.find({ isActive: true })
      .sort("order name")
      .lean();

    // Build tree structure
    const categoryMap = new Map();
    const tree: any[] = [];

    categories.forEach((cat: any) => {
      categoryMap.set(cat._id.toString(), { ...cat, children: [] });
    });

    categories.forEach((cat: any) => {
      const node = categoryMap.get(cat._id.toString());
      if (cat.parent) {
        const parent = categoryMap.get(cat.parent.toString());
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return ApiResponse.ok(res, "Category tree retrieved successfully", {
      categories: tree,
    });
  }
);

// @desc    Get category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id)
      .populate("parent", "name slug")
      .lean();

    if (!category) {
      throw ApiError.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Fetch children categories
    const children = await Category.find({
      parent: category._id,
      isActive: true,
    })
      .sort("order name")
      .lean();

    return ApiResponse.ok(res, "Category retrieved successfully", {
      category: {
        ...category,
        children,
      },
    });
  }
);

// @desc    Get category by slug
// @route   GET /api/v1/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate("parent", "name slug")
      .lean();

    if (!category) {
      throw ApiError.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    return ApiResponse.ok(res, "Category retrieved successfully", { category });
  }
);

// @desc    Get subcategories by parent slug
// @route   GET /api/v1/categories/:slug/children
// @access  Public
export const getSubcategories = asyncHandler(
  async (req: Request, res: Response) => {
    const parent = await Category.findOne({ slug: req.params.slug })
      .select("_id name slug")
      .lean();

    if (!parent) {
      throw ApiError.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    const children = await Category.find({
      parent: parent._id,
      isActive: true,
    })
      .sort("order name")
      .lean();

    return ApiResponse.ok(res, "Subcategories retrieved successfully", {
      parent,
      children,
    });
  }
);

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.create(req.body);

    return ApiResponse.created(res, "Category created successfully", {
      category,
    });
  }
);

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw ApiError.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    return ApiResponse.ok(res, "Category updated successfully", { category });
  }
);

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw ApiError.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({
      category: category._id,
    });
    if (productsCount > 0) {
      throw ApiError.badRequest(ERROR_MESSAGES.CATEGORY_HAS_PRODUCTS);
    }

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({
      parent: category._id,
    });
    if (subcategoriesCount > 0) {
      throw ApiError.badRequest("Cannot delete category with subcategories");
    }

    await category.deleteOne();

    return ApiResponse.ok(res, "Category deleted successfully");
  }
);
