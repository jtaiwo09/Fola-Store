import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  verifyPayment,
  getOrderStats,
  initializePayment,
  getDashboardStats,
} from "@/controllers/order.controller";
import {
  createOrderValidator,
  orderIdValidator,
  updateOrderStatusValidator,
} from "validators/order.validator";
import { validate } from "@/middlewares/validation.middleware";
import { authenticate, authorize } from "@/middlewares/auth.middleware";

const router = Router();

// Protected routes (All authenticated users)
router.use(authenticate);

router.post("/", validate(createOrderValidator), createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/my-orders", getMyOrders);
router.get("/:id", validate(orderIdValidator), getOrderById);
router.patch("/:id/cancel", validate(orderIdValidator), cancelOrder);
router.post(
  "/:id/initialize-payment",
  validate(orderIdValidator),
  initializePayment
);

// Admin only routes
router.get("/", authorize("admin", "staff"), getAllOrders);
router.get("/stats/overview", authorize("admin", "staff"), getOrderStats);
router.get("/dashboard/stats", getDashboardStats);
router.patch(
  "/:id/status",
  authorize("admin", "staff"),
  validate(updateOrderStatusValidator),
  updateOrderStatus
);

export default router;
