import { body, param } from "express-validator";
import mongoose from "mongoose";

export const productIdValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID"),
];

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must be lowercase with hyphens only"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid category ID"),

  body("basePrice")
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),

  body("salePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Sale price must be a positive number")
    .custom((value, { req }) => {
      if (value && value >= req.body.basePrice) {
        throw new Error("Sale price must be less than base price");
      }
      return true;
    }),

  body("currency")
    .optional()
    .isIn(["NGN", "USD", "EUR", "GBP"])
    .withMessage("Invalid currency"),

  body("productType")
    .optional()
    .isIn(["fabric", "readymade", "accessory", "other"])
    .withMessage("Invalid product type"),

  body("unitOfMeasure")
    .optional()
    .isIn(["yard", "meter", "piece", "set"])
    .withMessage("Invalid unit of measure"),

  body("variants")
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),

  body("variants.*.sku")
    .trim()
    .notEmpty()
    .withMessage("Variant SKU is required"),

  body("variants.*.color")
    .trim()
    .notEmpty()
    .withMessage("Variant color is required"),

  body("variants.*.colorHex")
    .trim()
    .notEmpty()
    .withMessage("Variant color hex is required")
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Invalid hex color format"),

  body("variants.*.stock")
    .isInt({ min: 0 })
    .withMessage("Variant stock must be a non-negative integer"),

  body("featuredImage")
    .trim()
    .notEmpty()
    .withMessage("Featured image is required")
    .isURL()
    .withMessage("Featured image must be a valid URL"),

  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one product image is required"),

  body("images.*").isURL().withMessage("Each image must be a valid URL"),
];

export const updateProductValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Product name must be between 3 and 200 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must be lowercase with hyphens only"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("category")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid category ID"),

  body("basePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),

  body("salePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Sale price must be a positive number"),
];
