import { Router } from "express";
import {
  getSettings,
  updateStoreSettings,
  updateShippingSettings,
  updatePaymentSettings,
  getPublicSettings,
} from "@/controllers/settings.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";

const router = Router();

// Public route
router.get("/public", getPublicSettings);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize("admin"));

router.get("/", getSettings);
router.put("/store", updateStoreSettings);
router.put("/shipping", updateShippingSettings);
router.put("/payment", updatePaymentSettings);

export default router;
