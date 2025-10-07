import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { config } from "@/config/env";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/config/constants";

// Generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Remove password from response
  const { password: _, ...userResponse } = user.toObject();

  return ApiResponse.created(res, SUCCESS_MESSAGES.REGISTER_SUCCESS, {
    user: userResponse,
    accessToken,
    refreshToken,
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.forbidden("Account is deactivated");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Remove password from response
  const { password: _, ...userResponse } = user.toObject();

  return ApiResponse.ok(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
    user: userResponse,
    accessToken,
    refreshToken,
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // In a production app, you would invalidate the token here
  // For now, we'll just send a success response
  return ApiResponse.ok(res, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw ApiError.badRequest("Refresh token is required");
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as {
        id: string;
      };

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        decoded.id
      );

      return ApiResponse.ok(res, "Token refreshed successfully", {
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_INVALID);
    }
  }
);

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user?._id);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return ApiResponse.ok(res, "User retrieved successfully", { user });
});

// @desc    Update user profile
// @route   PATCH /api/v1/auth/profile
// @access  Private
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findById((req as any).user?._id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    return ApiResponse.ok(res, "Profile updated successfully", { user });
  }
);

// @desc    Change password
// @route   PATCH /api/v1/auth/change-password
// @access  Private
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById((req as any).user?._id).select(
      "+password"
    );

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return ApiResponse.ok(res, "Password changed successfully");
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return ApiResponse.ok(
        res,
        "If email exists, password reset link will be sent"
      );
    }

    // Generate reset token (implement token generation logic)
    // Send email with reset link
    // For now, just return success

    return ApiResponse.ok(res, "Password reset link sent to email");
  }
);

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log(token, password);

    // Verify token and find user (implement token verification logic)
    // For now, just return success

    return ApiResponse.ok(res, "Password reset successfully");
  }
);
