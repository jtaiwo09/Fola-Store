import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getSubcategories,
} from "@/controllers/category.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";
import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "validators/category.validator";
import { validate } from "@/middlewares/validation.middleware";

const router = Router();

// Public routes
router.get("/", getAllCategories);
router.get("/tree", getCategoryTree);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", validate(categoryIdValidator), getCategoryById);
router.get("/:slug/children", getSubcategories);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize("admin", "staff"));

router.post("/", validate(createCategoryValidator), createCategory);
router.put("/:id", validate(updateCategoryValidator), updateCategory);
router.delete("/:id", validate(categoryIdValidator), deleteCategory);

export default router;
