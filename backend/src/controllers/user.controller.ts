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

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user!._id).select("-password").lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return ApiResponse.ok(res, "Profile retrieved successfully", { user });
  }
);

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findById(req.user!._id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // Remove password from response
    const userResponse = await User.findById(user._id)
      .select("-password")
      .lean();

    return ApiResponse.ok(res, "Profile updated successfully", {
      user: userResponse,
    });
  }
);

// @desc    Get user addresses
// @route   GET /api/v1/users/addresses
// @access  Private
export const getAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.user!._id).select("addresses").lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return ApiResponse.ok(res, "Addresses retrieved successfully", {
      addresses: user.addresses || [],
    });
  }
);

// @desc    Add address
// @route   POST /api/v1/users/addresses
// @access  Private
export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  const user = await User.findById(req.user!._id);

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // If this is the first address or isDefault is true, set all others to false
  if (user.addresses.length === 0 || isDefault) {
    user.addresses.forEach((addr: any) => {
      addr.isDefault = false;
    });
  }

  // Create new address
  const newAddress = {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
    isDefault: user.addresses.length === 0 ? true : isDefault || false,
  };

  user.addresses.push(newAddress as any);
  await user.save();

  // Get the newly added address (last item)
  const addedAddress = user.addresses[user.addresses.length - 1];

  return ApiResponse.created(res, "Address added successfully", {
    address: addedAddress,
  });
});

// @desc    Update address
// @route   PUT /api/v1/users/addresses/:addressId
// @access  Private
export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

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

    // If setting as default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    const currentAddress = user.addresses[addressIndex] as any;
    currentAddress.firstName = firstName || currentAddress.firstName;
    currentAddress.lastName = lastName || currentAddress.lastName;
    currentAddress.email = email || currentAddress.email;
    currentAddress.phone = phone || currentAddress.phone;
    currentAddress.address = address || currentAddress.address;
    currentAddress.city = city || currentAddress.city;
    currentAddress.state = state || currentAddress.state;
    currentAddress.postalCode =
      postalCode !== undefined ? postalCode : currentAddress.postalCode;
    currentAddress.country = country || currentAddress.country;
    currentAddress.isDefault =
      isDefault !== undefined ? isDefault : currentAddress.isDefault;

    await user.save();

    return ApiResponse.ok(res, "Address updated successfully", {
      address: user.addresses[addressIndex],
    });
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

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      throw ApiError.notFound("Address not found");
    }

    const wasDefault = (user.addresses[addressIndex] as any).isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If the deleted address was default and there are other addresses, set the first one as default
    if (wasDefault && user.addresses.length > 0) {
      (user.addresses[0] as any).isDefault = true;
    }

    await user.save();

    return ApiResponse.ok(res, "Address deleted successfully");
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

    const addressIndex = user.addresses.findIndex(
      (addr: any) => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      throw ApiError.notFound("Address not found");
    }

    // Set all addresses to not default
    user.addresses.forEach((addr: any) => {
      addr.isDefault = false;
    });

    // Set the selected address as default
    (user.addresses[addressIndex] as any).isDefault = true;

    await user.save();

    return ApiResponse.ok(res, "Default address updated successfully", {
      address: user.addresses[addressIndex],
    });
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
