import mongoose, { Schema, Types } from "mongoose";
import { BaseDocument } from "../types";

export interface IProductVariant {
  sku: string;
  color: string;
  colorHex: string;
  images: string[];
  stock: number;
  price?: number;
  isAvailable: boolean;
}

export interface IProductSpecifications {
  width?: string;
  weight?: string;
  composition?: string;
  careInstructions?: string;
  origin?: string;
  pattern?: string;
  texture?: string;
  opacity?: string;
  stretch?: string;
  [key: string]: any;
}

export interface IProductMetadata {
  shippingTime?: string; // e.g., "2-3 business days"
  returnPolicy?: string; // e.g., "30-day return policy"
  warranty?: string; // e.g., "1-year manufacturer warranty"
}

export interface IProduct extends BaseDocument {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  tags: string[];
  productType: "fabric" | "readymade" | "accessory" | "other";

  basePrice: number;
  salePrice?: number;
  compareAtPrice?: number;
  currency: string;

  fabricType?: string;
  unitOfMeasure: "yard" | "meter" | "piece" | "set";
  minimumOrder?: number;
  maximumOrder?: number;

  variants: IProductVariant[];
  specifications: IProductSpecifications;
  metadata: IProductMetadata;

  totalStock: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  lowStockThreshold?: number; // NEW - Alert when stock falls below this number

  featuredImage: string;
  images: string[];
  video?: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  status: "draft" | "active" | "archived" | "out_of_stock";
  isPublished: boolean;
  isFeatured: boolean;

  averageRating: number;
  reviewCount: number;

  publishedAt?: Date;
  deletedAt?: Date;

  isInStock(quantity?: number): boolean;
  getVariantByColor(color: string): IProductVariant | undefined;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  colorHex: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  price: { type: Number, min: 0 },
  isAvailable: { type: Boolean, default: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    shortDescription: {
      type: String,
      maxlength: 500,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [{ type: String, trim: true }],
    productType: {
      type: String,
      enum: ["fabric", "readymade", "accessory", "other"],
      default: "fabric",
      index: true,
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: { type: Number, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    fabricType: { type: String, trim: true },
    unitOfMeasure: {
      type: String,
      enum: ["yard", "meter", "piece", "set"],
      default: "yard",
    },
    minimumOrder: { type: Number, default: 1, min: 1 },
    maximumOrder: { type: Number, min: 1 },

    variants: [ProductVariantSchema],

    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // NEW METADATA FIELD
    metadata: {
      shippingTime: { type: String, default: "2-3 business days" },
      returnPolicy: { type: String, default: "30-day return policy" },
      warranty: { type: String },
    },

    totalStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    trackInventory: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false },

    featuredImage: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },

    metaTitle: { type: String, maxlength: 100 },
    metaDescription: { type: String, maxlength: 300 },
    metaKeywords: [{ type: String }],

    status: {
      type: String,
      enum: ["draft", "active", "archived", "out_of_stock"],
      default: "draft",
      index: true,
    },
    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: { type: Number, default: 0, min: 0 },

    publishedAt: { type: Date },
    deletedAt: { type: Date, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, status: 1, isPublished: 1 });
ProductSchema.index({ basePrice: 1, salePrice: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ averageRating: -1, reviewCount: -1 });

// Virtuals
ProductSchema.virtual("effectivePrice").get(function () {
  return this.salePrice || this.basePrice;
});

ProductSchema.virtual("discountPercentage").get(function () {
  if (this.salePrice && this.basePrice > this.salePrice) {
    return Math.round(
      ((this.basePrice - this.salePrice) / this.basePrice) * 100
    );
  }
  return 0;
});

// Virtual for badge (new arrival check - 7 days)
ProductSchema.virtual("badge").get(function () {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (this.createdAt && this.createdAt > sevenDaysAgo) {
    return "New Arrival";
  }

  // Calculate discount percentage directly instead of referencing the virtual
  if (this.salePrice && this.basePrice > this.salePrice) {
    const discount = Math.round(
      ((this.basePrice - this.salePrice) / this.basePrice) * 100
    );
    return `${discount}% Off`;
  }

  return null;
});

// Pre-save middleware
ProductSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((total, variant) => {
      return total + (variant.stock || 0);
    }, 0);
  }
  next();
});

// Methods
ProductSchema.methods.isInStock = function (quantity: number = 1): boolean {
  return this.totalStock >= quantity || this.allowBackorder;
};

ProductSchema.methods.getVariantByColor = function (color: string) {
  return this.variants.find(
    (v: any) => v.color.toLowerCase() === color.toLowerCase()
  );
};

export default mongoose.model<IProduct>("Product", ProductSchema);
