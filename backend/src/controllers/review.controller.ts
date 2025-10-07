import { Request, Response } from "express";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { APP_CONSTANTS } from "@/config/constants";

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { product, rating, title, comment, images } = req.body;

    const productExists = await Product.findById(product);
    if (!productExists) {
      throw ApiError.notFound("Product not found");
    }

    const existingReview = await Review.findOne({
      product,
      customer: req.user!._id,
    });

    if (existingReview) {
      throw ApiError.conflict("You have already reviewed this product");
    }

    const order = await Order.findOne({
      customer: req.user!._id,
      "items.product": product,
      status: "delivered",
    });

    const review = await Review.create({
      product,
      customer: req.user!._id,
      order: order?._id,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: !!order,
    });

    await updateProductRating(product);

    return ApiResponse.created(res, "Review created successfully", { review });
  }
);

// @desc    Get reviews for a product
// @route   GET /api/v1/reviews/product/:productId
// @access  Public
export const getProductReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = APP_CONSTANTS.DEFAULT_PAGE,
      limit = APP_CONSTANTS.DEFAULT_LIMIT,
      sort = "-createdAt",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(
      parseInt(limit as string, 10),
      APP_CONSTANTS.MAX_LIMIT
    );
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId, isPublished: true })
        .populate("customer", "firstName lastName avatar")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({
        product: req.params.productId,
        isPublished: true,
      }),
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

// @desc    Get review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReviewById = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id)
      .populate("customer", "firstName lastName avatar")
      .populate("product", "name slug featuredImage")
      .lean();

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    return ApiResponse.ok(res, "Review retrieved successfully", { review });
  }
);

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    if (review.customer.toString() !== req.user!._id.toString()) {
      throw ApiError.forbidden("You can only update your own reviews");
    }

    const { rating, title, comment, images } = req.body;

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    await updateProductRating(review.product);

    return ApiResponse.ok(res, "Review updated successfully", { review });
  }
);

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    if (
      review.customer.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      throw ApiError.forbidden("You can only delete your own reviews");
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRating(productId);

    return ApiResponse.ok(res, "Review deleted successfully");
  }
);

// @desc    Vote review as helpful
// @route   POST /api/v1/reviews/:id/vote/helpful
// @access  Private
export const voteReviewHelpful = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    const userId = req.user!._id;

    // Check if user already voted helpful
    const alreadyVotedHelpful = review.helpfulVotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyVotedHelpful) {
      throw ApiError.badRequest(
        "You have already voted this review as helpful"
      );
    }

    // Remove from not helpful if exists
    const wasNotHelpful = review.notHelpfulVotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (wasNotHelpful) {
      review.notHelpfulVotes = review.notHelpfulVotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
    }

    // Add to helpful
    review.helpfulVotes.push(userId);
    review.helpfulCount += 1;

    await review.save();

    return ApiResponse.ok(res, "Review marked as helpful", { review });
  }
);

// @desc    Vote review as not helpful
// @route   POST /api/v1/reviews/:id/vote/not-helpful
// @access  Private
export const voteReviewNotHelpful = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    const userId = req.user!._id;

    // Check if user already voted not helpful
    const alreadyVotedNotHelpful = review.notHelpfulVotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyVotedNotHelpful) {
      throw ApiError.badRequest(
        "You have already voted this review as not helpful"
      );
    }

    // Remove from helpful if exists
    const wasHelpful = review.helpfulVotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (wasHelpful) {
      review.helpfulVotes = review.helpfulVotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    }

    // Add to not helpful
    review.notHelpfulVotes.push(userId);
    review.notHelpfulCount += 1;

    await review.save();

    return ApiResponse.ok(res, "Review marked as not helpful", { review });
  }
);

// @desc    Remove vote from review
// @route   DELETE /api/v1/reviews/:id/vote
// @access  Private
export const removeReviewVote = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    const userId = req.user!._id;

    // Remove from helpful if exists
    const wasHelpful = review.helpfulVotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (wasHelpful) {
      review.helpfulVotes = review.helpfulVotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    }

    // Remove from not helpful if exists
    const wasNotHelpful = review.notHelpfulVotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (wasNotHelpful) {
      review.notHelpfulVotes = review.notHelpfulVotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.notHelpfulCount = Math.max(0, review.notHelpfulCount - 1);
    }

    if (!wasHelpful && !wasNotHelpful) {
      throw ApiError.badRequest("You have not voted on this review");
    }

    await review.save();

    return ApiResponse.ok(res, "Vote removed successfully", { review });
  }
);

// Helper function to update product rating
const updateProductRating = async (productId: any) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isPublished: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};
