// routes/user.routes.ts - UPDATE your existing file

import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  syncClerkUser,
} from "@/controllers/user.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import { userIdValidator, addressValidator } from "@/validators/user.validator";
import { validate } from "@/middlewares/validation.middleware";

const router = Router();

// Public route - Clerk webhook
router.post("/sync-clerk", syncClerkUser);

// All routes below require authentication
router.use(authenticate);

// User profile routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// User address management routes
router.get("/addresses", getAddresses);
router.post("/addresses", validate(addressValidator), addAddress);
router.put("/addresses/:addressId", validate(addressValidator), updateAddress);
router.delete("/addresses/:addressId", deleteAddress);
router.patch("/addresses/:addressId/default", setDefaultAddress);

// Admin only routes
router.get("/", authorize("admin"), getAllUsers);
router.get("/:id", authorize("admin"), validate(userIdValidator), getUserById);
router.put("/:id", authorize("admin"), validate(userIdValidator), updateUser);
router.delete(
  "/:id",
  authorize("admin"),
  validate(userIdValidator),
  deleteUser
);

export default router;
