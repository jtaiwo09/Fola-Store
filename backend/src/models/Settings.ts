// backend/src/models/Settings.ts
import mongoose, { Schema } from "mongoose";
import { BaseDocument } from "../types";

export interface IStoreSettings {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  logo?: string;
  favicon?: string;
  currency: string;
  timezone: string;
  language: string;
}

export interface IShippingSettings {
  flatRate: number;
  freeShippingThreshold?: number;
  estimatedDeliveryDays: {
    min: number;
    max: number;
  };
  shippingZones: Array<{
    name: string;
    states: string[];
    rate: number;
  }>;
}

export interface IPaymentSettings {
  paystack: {
    enabled: boolean;
    publicKey?: string;
    secretKey?: string;
  };
  bankTransfer: {
    enabled: boolean;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
  };
  cashOnDelivery: {
    enabled: boolean;
  };
}

export interface ISettings extends BaseDocument {
  store: IStoreSettings;
  shipping: IShippingSettings;
  payment: IPaymentSettings;
}

const SettingsSchema = new Schema<ISettings>(
  {
    store: {
      name: { type: String, required: true, default: "FOLA STORE" },
      description: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      logo: String,
      favicon: String,
      currency: { type: String, default: "NGN" },
      timezone: { type: String, default: "Africa/Lagos" },
      language: { type: String, default: "en" },
    },
    shipping: {
      flatRate: { type: Number, default: 1500 },
      freeShippingThreshold: { type: Number },
      estimatedDeliveryDays: {
        min: { type: Number, default: 3 },
        max: { type: Number, default: 7 },
      },
      shippingZones: [
        {
          name: String,
          states: [String],
          rate: Number,
        },
      ],
    },
    payment: {
      paystack: {
        enabled: { type: Boolean, default: true },
        publicKey: String,
        secretKey: String,
      },
      bankTransfer: {
        enabled: { type: Boolean, default: false },
        accountName: String,
        accountNumber: String,
        bankName: String,
      },
      cashOnDelivery: {
        enabled: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
