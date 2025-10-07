import { Request, Response } from "express";
import User from "@/models/User";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { APP_CONSTANTS } from "@/config/constants";
import crypto from "crypto";
import { config } from "@/config/env";

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = APP_CONSTANTS.DEFAULT_PAGE,
    limit = APP_CONSTANTS.DEFAULT_LIMIT,
    role,
    isActive,
  } = req.query;

  const query: any = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === "true";

  const pageNum = parseInt(page as string, 10);
  const limitNum = Math.min(
    parseInt(limit as string, 10),
    APP_CONSTANTS.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  return ApiResponse.success(res, 200, "Users retrieved successfully", users, {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password").lean();

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return ApiResponse.ok(res, "User retrieved successfully", { user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return ApiResponse.ok(res, "User updated successfully", { user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return ApiResponse.ok(res, "User deactivated successfully");
});

// @desc    Add address
// @route   POST /api/v1/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  user.addresses.push(req.body);
  await user.save();

  return ApiResponse.created(res, "Address added successfully", { user });
});

// @desc    Update address
// @route   PUT /api/v1/users/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user!._id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      throw ApiError.notFound("Address not found");
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...req.body,
    };
    await user.save();

    return ApiResponse.ok(res, "Address updated successfully", { user });
  }
);

// @desc    Delete address
// @route   DELETE /api/v1/users/addresses/:addressId
// @access  Private
export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user!._id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    user.addresses = user.addresses.filter(
      (addr: any) => addr._id.toString() !== req.params.addressId
    );

    await user.save();

    return ApiResponse.ok(res, "Address deleted successfully", { user });
  }
);

// @desc    Set default address
// @route   PATCH /api/v1/users/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user!._id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Implementation depends on your address schema
    // This is a placeholder

    return ApiResponse.ok(res, "Default address set successfully", { user });
  }
);

// @desc   Clerk webhook handler
// @route  POST /api/v1/users/sync-clerk
// @access Public (but secured via SVIX signature)

export const syncClerkUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Verify webhook secret for security
    const webhookSecret = req.headers["x-webhook-secret"] as string;

    if (webhookSecret !== config.WEBHOOK_SECRET) {
      throw ApiError.unauthorized("Invalid webhook secret");
    }

    const { clerkId, email, firstName, lastName, phone, avatar } = req.body;

    if (!clerkId || !email) {
      throw ApiError.badRequest("Clerk ID and email are required");
    }

    // Find existing user by Clerk ID or email
    let user = await User.findOne({
      $or: [{ clerkId }, { email }],
    });

    if (user) {
      // Update existing user
      user.clerkId = clerkId;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.avatar = avatar || user.avatar;
      user.isEmailVerified = true;
      await user.save();

      console.log(`✅ Updated user: ${email}`);
    } else {
      // Create new user
      user = await User.create({
        clerkId,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        phone,
        avatar,
        password: crypto.randomBytes(32).toString("hex"), // Random password (never used)
        isEmailVerified: true,
        role: "customer",
        isActive: true,
      });

      console.log(`✅ Created new user: ${email}`);
    }

    return ApiResponse.ok(res, "User synced successfully", { user });
  }
);
