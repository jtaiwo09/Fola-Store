// backend/src/routes/upload.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  uploadImage,
  uploadImages,
  deleteImage,
  uploadReviewImages,
} from "@/controllers/upload.controller";
import { authenticate, authorize } from "@/middlewares/auth.middleware";

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any, false);
    }
  },
});

// Protected routes (Admin/Staff only)
router.use(authenticate);
router.post("/review-images", upload.array("images", 5), uploadReviewImages);
router.use(authorize("admin", "staff"));

router.post("/image", upload.single("image"), uploadImage);
router.post("/images", upload.array("images", 10), uploadImages);
router.delete("/image", deleteImage);

export default router;
