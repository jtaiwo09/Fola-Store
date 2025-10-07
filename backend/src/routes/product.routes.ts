import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  checkStock,
  bulkPublishProducts,
  bulkDeleteProducts,
  bulkUpdateStatus,
  getFilterOptions,
} from "@/controllers/product.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "@/validators/product.validator";
import { validate } from "@/middlewares/validation.middleware";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/filters/options", getFilterOptions);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", validate(productIdValidator), getProductById);
router.post("/:id/check-stock", validate(productIdValidator), checkStock);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize("admin", "staff"));

// Bulk actions (must come before /:id routes)
router.patch("/bulk/publish", bulkPublishProducts);
router.patch("/bulk/status", bulkUpdateStatus);
router.delete("/bulk", bulkDeleteProducts);

// Single product actions
router.post("/", validate(createProductValidator), createProduct);
router.put("/:id", validate(updateProductValidator), updateProduct);
router.delete("/:id", validate(productIdValidator), deleteProduct);

export default router;
