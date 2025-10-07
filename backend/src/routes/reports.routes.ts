import { Router } from "express";
import {
  getSalesReport,
  getInventoryReport,
  getProductPerformanceReport,
} from "@/controllers/reports.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("admin", "staff"));

router.get("/sales", getSalesReport);
router.get("/inventory", getInventoryReport);
router.get("/product-performance", getProductPerformanceReport);

export default router;
