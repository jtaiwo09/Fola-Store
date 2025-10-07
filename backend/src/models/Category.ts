// models/Category.ts
import mongoose, { Schema, Types } from "mongoose";
import { BaseDocument } from "../types";

export interface ICategory extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId;
  level: number;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: { type: String, maxlength: 1000 },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: { type: String },
    icon: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    metaTitle: { type: String, maxlength: 100 },
    metaDescription: { type: String, maxlength: 300 },
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ parent: 1, isActive: 1, order: 1 });
CategorySchema.index({ slug: 1, isActive: 1 });

// Virtual for subcategories
CategorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Method to get category path
CategorySchema.methods.getPath = async function () {
  const path = [this];
  let current: any = this;

  while (current.parent) {
    current = await mongoose.model("Category").findById(current.parent);
    if (current) path.unshift(current);
    else break;
  }

  return path;
};

export default mongoose.model<ICategory>("Category", CategorySchema);
