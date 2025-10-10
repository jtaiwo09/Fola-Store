import mongoose, { Schema, Types } from "mongoose";
import { BaseDocument } from "../types";

export interface IWishlistItem {
  product: Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends BaseDocument {
  user: Types.ObjectId;
  items: IWishlistItem[];
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [WishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
WishlistSchema.index({ user: 1 });
WishlistSchema.index({ "items.product": 1 });

export default mongoose.model<IWishlist>("Wishlist", WishlistSchema);
