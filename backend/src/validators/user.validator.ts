// validators/user.validator.ts - ADD to your existing validators

import { body, param } from "express-validator";

export const userIdValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

export const addressValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 11 })
    .withMessage("Phone number must be at least 11 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),

  body("postalCode").trim().notEmpty().withMessage("Postal code is required"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];
