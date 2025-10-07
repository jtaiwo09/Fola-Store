import { Router } from "express";
import {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
  voteReviewHelpful,
  voteReviewNotHelpful,
  removeReviewVote,
} from "@/controllers/review.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  createReviewValidator,
  updateReviewValidator,
  reviewIdValidator,
} from "@/validators/review.validator";
import { validate } from "@/middlewares/validation.middleware";

const router = Router();

// Public routes
router.get("/product/:productId", getProductReviews);
router.get("/:id", validate(reviewIdValidator), getReviewById);

// Protected routes
router.use(authenticate);

router.post("/", validate(createReviewValidator), createReview);
router.put("/:id", validate(updateReviewValidator), updateReview);
router.delete("/:id", validate(reviewIdValidator), deleteReview);

// Voting routes
router.post(
  "/:id/vote/helpful",
  validate(reviewIdValidator),
  voteReviewHelpful
);
router.post(
  "/:id/vote/not-helpful",
  validate(reviewIdValidator),
  voteReviewNotHelpful
);
router.delete("/:id/vote", validate(reviewIdValidator), removeReviewVote);

export default router;
