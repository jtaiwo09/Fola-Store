import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "@/validators/auth.validator";
import { validate } from "@/middlewares/validation.middleware";

const router = Router();

// Public routes
router.post("/register", validate(registerValidator), register);
router.post("/login", validate(loginValidator), login);
router.post("/refresh-token", refreshToken);
router.post(
  "/forgot-password",
  validate(forgotPasswordValidator),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  validate(resetPasswordValidator),
  resetPassword
);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post("/logout", logout);
router.get("/me", getMe);
router.patch("/profile", updateProfile);
router.patch(
  "/change-password",
  validate(changePasswordValidator),
  changePassword
);

export default router;
