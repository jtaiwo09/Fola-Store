import { body, param } from "express-validator";
import mongoose from "mongoose";

export const orderIdValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid order ID"),
];

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.product")
    .notEmpty()
    .withMessage("Product ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID"),

  body("items.*.variant.sku")
    .trim()
    .notEmpty()
    .withMessage("Variant SKU is required"),

  body("items.*.variant.color")
    .trim()
    .notEmpty()
    .withMessage("Variant color is required"),

  body("items.*.variant.colorHex")
    .trim()
    .notEmpty()
    .withMessage("Variant color hex is required"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("shippingAddress.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("shippingAddress.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("shippingAddress.email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required"),

  body("shippingAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("shippingAddress.postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required"),

  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("billingAddress.firstName")
    .trim()
    .notEmpty()
    .withMessage("Billing first name is required"),

  body("billingAddress.lastName")
    .trim()
    .notEmpty()
    .withMessage("Billing last name is required"),

  body("billingAddress.email")
    .trim()
    .notEmpty()
    .withMessage("Billing email is required")
    .isEmail()
    .withMessage("Invalid billing email format"),

  body("paymentReference")
    .trim()
    .notEmpty()
    .withMessage("Payment reference is required"),
];

export const updateOrderStatusValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid order ID"),

  body("status")
    .isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .withMessage("Invalid order status"),

  body("trackingNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Tracking number cannot be empty"),

  body("carrier")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Carrier name cannot be empty"),
];
