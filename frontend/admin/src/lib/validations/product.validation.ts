// lib/validations/product.validation.ts
import { z } from "zod";

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  color: z.string().min(1, "Color is required"),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format"),
  images: z.array(z.string().url()).min(1, "At least one image required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  price: z.coerce
    .number()
    .min(0)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)), // FIX HERE
  isAvailable: z.boolean().default(true),
});

export const productFormSchema = z
  .object({
    // Basic Information
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(200, "Name must not exceed 200 characters"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must not exceed 5000 characters"),
    shortDescription: z.string().max(500).optional(),

    // Classification
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).default([]).optional(),
    productType: z
      .enum(["fabric", "readymade", "accessory", "other"])
      .default("fabric"),

    // Pricing
    basePrice: z.number().min(0, "Base price must be positive"),
    salePrice: z.number().min(0).optional(),
    compareAtPrice: z.number().min(0).optional(),
    currency: z.string().default("NGN"),

    // Fabric Specific
    fabricType: z.string().optional(),
    unitOfMeasure: z.enum(["yard", "meter", "piece", "set"]).default("yard"),
    minimumOrder: z.number().min(1).default(1),
    maximumOrder: z.number().min(1).optional(),

    // Variants
    variants: z
      .array(productVariantSchema)
      .min(1, "At least one variant required"),

    // Specifications - FIXED
    specifications: z.record(z.string(), z.any()).default({}),

    // Media
    featuredImage: z.string().url("Featured image is required"),
    images: z.array(z.string().url()).min(1, "At least one image required"),
    video: z.string().url().optional(),

    // SEO
    metaTitle: z.string().max(100).optional(),
    metaDescription: z.string().max(300).optional(),
    metaKeywords: z.array(z.string()).optional(),

    // Status
    status: z
      .enum(["draft", "active", "archived", "out_of_stock"])
      .default("draft"),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    trackInventory: z.boolean().default(true),
    allowBackorder: z.boolean().default(false),
    lowStockThreshold: z.number(),
  })
  .refine(
    (data) => {
      if (data.salePrice && data.salePrice >= data.basePrice) {
        return false;
      }
      return true;
    },
    {
      message: "Sale price must be less than base price",
      path: ["salePrice"],
    }
  );

export type ProductFormData = z.infer<typeof productFormSchema>;
