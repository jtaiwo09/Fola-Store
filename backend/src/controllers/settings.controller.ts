// backend/src/controllers/settings.controller.ts
import { Request, Response } from "express";
import Settings from "@/models/Settings";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { emitToStoreClients } from "@/config/socket";

// @desc    Get all settings
// @route   GET /api/v1/settings
// @access  Private/Admin
export const getSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        store: {
          name: "Fola Store",
          email: "info@folastore.com",
          currency: "NGN",
          timezone: "Africa/Lagos",
          language: "en",
        },
        shipping: {
          flatRate: 1500,
          estimatedDeliveryDays: { min: 3, max: 7 },
          shippingZones: [],
        },
        payment: {
          paystack: { enabled: true },
          bankTransfer: { enabled: false },
          cashOnDelivery: { enabled: false },
        },
      });
    }

    return ApiResponse.ok(res, "Settings retrieved successfully", { settings });
  }
);

// @desc    Update store settings
// @route   PUT /api/v1/settings/store
// @access  Private/Admin
export const updateStoreSettings = asyncHandler(
  async (req: Request, res: Response) => {
    let settings = await Settings.findOne();

    if (!settings) {
      throw ApiError.notFound("Settings not found");
    }

    settings.store = { ...settings.store, ...req.body };
    await settings.save();

    emitToStoreClients("settings-updated", {
      type: "store",
      data: settings.store,
    });

    return ApiResponse.ok(res, "Store settings updated successfully", {
      settings,
    });
  }
);

// @desc    Update shipping settings
// @route   PUT /api/v1/settings/shipping
// @access  Private/Admin
export const updateShippingSettings = asyncHandler(
  async (req: Request, res: Response) => {
    let settings = await Settings.findOne();

    if (!settings) {
      throw ApiError.notFound("Settings not found");
    }

    settings.shipping = { ...settings.shipping, ...req.body };
    await settings.save();

    emitToStoreClients("settings-updated", {
      type: "shipping",
      data: settings.shipping,
    });

    return ApiResponse.ok(res, "Shipping settings updated successfully", {
      settings,
    });
  }
);

// @desc    Update payment settings
// @route   PUT /api/v1/settings/payment
// @access  Private/Admin
export const updatePaymentSettings = asyncHandler(
  async (req: Request, res: Response) => {
    let settings = await Settings.findOne();

    if (!settings) {
      throw ApiError.notFound("Settings not found");
    }

    settings.payment = { ...settings.payment, ...req.body };
    await settings.save();

    emitToStoreClients("settings-updated", {
      type: "payment",
      data: settings.payment,
    });

    return ApiResponse.ok(res, "Payment settings updated successfully", {
      settings,
    });
  }
);

// @desc    Get public settings
// @route   GET /api/v1/settings/public
// @access  Public
export const getPublicSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await Settings.findOne().select(
      "store.name store.description store.logo store.currency store.language " +
        "payment.paystack.enabled payment.cashOnDelivery.enabled payment.bankTransfer.enabled " +
        "shipping.flatRate shipping.estimatedDeliveryDays"
    );

    return ApiResponse.ok(res, "Public settings retrieved", {
      settings: settings || {},
    });
  }
);
