import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import orderRoutes from "./order.routes";
import reviewRoutes from "./review.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import uploadRoutes from "./upload.routes";
import settingsRoutes from "./settings.routes";
import reportsRoutes from "./reports.routes";
import notificationsRoutes from "./notification.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Fola Store API v1",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      products: "/api/v1/products",
      categories: "/api/v1/categories",
      orders: "/api/v1/orders",
      reviews: "/api/v1/reviews",
      users: "/api/v1/users",
      admin: "/api/v1/admin",
      reports: "/api/v1/admin/reports",
      upload: "/api/v1/upload",
      notifications: "/api/v1/notifications",
      settings: "/api/v1/settings",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/reports", reportsRoutes);
router.use("/upload", uploadRoutes);
router.use("/settings", settingsRoutes);
router.use("/notifications", notificationsRoutes);

export default router;
