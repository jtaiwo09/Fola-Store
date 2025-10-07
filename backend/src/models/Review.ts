import mongoose, { Schema, Types } from "mongoose";
import { BaseDocument } from "../types";

export interface IReview extends BaseDocument {
  product: Types.ObjectId;
  customer: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  helpfulCount: number;
  notHelpfulCount: number; // NEW
  helpfulVotes: Types.ObjectId[]; // NEW - Track who voted helpful
  notHelpfulVotes: Types.ObjectId[]; // NEW - Track who voted not helpful
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: { type: String, maxlength: 100 },
    comment: { type: String, maxlength: 1000 },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false, index: true },
    helpfulCount: { type: Number, default: 0, min: 0 },
    notHelpfulCount: { type: Number, default: 0, min: 0 },
    helpfulVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notHelpfulVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews
ReviewSchema.index({ product: 1, customer: 1 }, { unique: true });
ReviewSchema.index({ product: 1, isPublished: 1, createdAt: -1 });

export default mongoose.model<IReview>("Review", ReviewSchema);
