import { Router } from "express";
import {
  getAdminStats,
  getLowStockProducts,
  getAllReviews,
  updateReviewPublishStatus,
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getProductAnalytics, // NEW IMPORT
} from "@/controllers/admin.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import {
  createStaffValidator,
  updateStaffValidator,
  staffIdValidator,
} from "@/validators/staff.validator";
import { validate } from "@/middlewares/validation.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("admin", "staff"));

// Stats & Reports
router.get("/stats", getAdminStats);
router.get("/low-stock", getLowStockProducts);

// Product Analytics
router.get("/products/:id/analytics", getProductAnalytics);

// Reviews Management
router.get("/reviews", getAllReviews);
router.patch("/reviews/:id/publish", updateReviewPublishStatus);

// Staff Management (Admin only)
router.get("/staff", authorize("admin"), getAllStaff);
router.post(
  "/staff",
  authorize("admin"),
  validate(createStaffValidator),
  createStaff
);
router.patch(
  "/staff/:id",
  authorize("admin"),
  validate(updateStaffValidator),
  updateStaff
);
router.delete(
  "/staff/:id",
  authorize("admin"),
  validate(staffIdValidator),
  deleteStaff
);

export default router;
