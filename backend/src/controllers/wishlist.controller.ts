import { Request, Response } from "express";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user!._id }).populate({
    path: "items.product",
    populate: { path: "category", select: "name slug" },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user!._id,
      items: [],
    });
  }

  return ApiResponse.ok(res, "Wishlist retrieved successfully", {
    wishlist,
  });
});

// @desc    Add item to wishlist
// @route   POST /api/v1/wishlist/items
// @access  Private
export const addToWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.body;

    if (!productId) {
      throw ApiError.badRequest("Product ID is required");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user!._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user!._id,
        items: [],
      });
    }

    // Check if product already in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      throw ApiError.badRequest("Product already in wishlist");
    }

    // Add to wishlist
    wishlist.items.push({
      product: productId,
      addedAt: new Date(),
    });

    await wishlist.save();

    // Populate and return
    await wishlist.populate({
      path: "items.product",
      populate: { path: "category", select: "name slug" },
    });

    return ApiResponse.ok(res, "Added to wishlist", { wishlist });
  }
);

// @desc    Remove item from wishlist
// @route   DELETE /api/v1/wishlist/items/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user!._id });

    if (!wishlist) {
      throw ApiError.notFound("Wishlist not found");
    }

    const itemExists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      throw ApiError.notFound("Product not in wishlist");
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    await wishlist.populate({
      path: "items.product",
      populate: { path: "category", select: "name slug" },
    });

    return ApiResponse.ok(res, "Removed from wishlist", { wishlist });
  }
);

// @desc    Clear wishlist
// @route   DELETE /api/v1/wishlist
// @access  Private
export const clearWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const wishlist = await Wishlist.findOne({ user: req.user!._id });

    if (!wishlist) {
      throw ApiError.notFound("Wishlist not found");
    }

    wishlist.items = [];
    await wishlist.save();

    return ApiResponse.ok(res, "Wishlist cleared", { wishlist });
  }
);

// @desc    Check if product is in wishlist
// @route   GET /api/v1/wishlist/check/:productId
// @access  Private
export const checkInWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user!._id });

    const inWishlist = wishlist
      ? wishlist.items.some((item) => item.product.toString() === productId)
      : false;

    return ApiResponse.ok(res, "Checked wishlist status", { inWishlist });
  }
);

// Add this new function
// @desc    Get wishlist product IDs (lightweight)
// @route   GET /api/v1/wishlist/ids
// @access  Private
export const getWishlistIds = asyncHandler(
  async (req: Request, res: Response) => {
    const wishlist = await Wishlist.findOne({ user: req.user!._id })
      .select("items.product")
      .lean();

    const productIds = wishlist
      ? wishlist.items.map((item) => item.product.toString())
      : [];

    return ApiResponse.ok(res, "Wishlist IDs retrieved successfully", {
      productIds,
    });
  }
);
