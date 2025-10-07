import mongoose, { Schema, Types } from "mongoose";
import { BaseDocument } from "../types";

export interface INotification extends BaseDocument {
  recipient: Types.ObjectId;
  type: "low_stock" | "new_order" | "order_status" | "review" | "general";
  title: string;
  message: string;
  data?: any; // Additional contextual data (productId, orderId, etc.)
  isRead: boolean;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["low_stock", "new_order", "order_status", "review", "general"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, type: 1 });

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
