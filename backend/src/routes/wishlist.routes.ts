import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkInWishlist,
  getWishlistIds,
} from "@/controllers/wishlist.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getWishlist);
router.get("/ids", getWishlistIds);
router.post("/items", addToWishlist);
router.delete("/items/:productId", removeFromWishlist);
router.delete("/", clearWishlist);
router.get("/check/:productId", checkInWishlist);

export default router;
