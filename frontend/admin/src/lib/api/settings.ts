// lib/api/settings.ts
import apiClient, { ApiResponse } from "./client";

export interface StoreSettings {
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

export interface ShippingSettings {
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

export interface PaymentSettings {
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

export interface Settings {
  _id: string;
  store: StoreSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
  createdAt: string;
  updatedAt: string;
}

export const settingsApi = {
  getAll: async (): Promise<ApiResponse<{ settings: Settings }>> => {
    const response = await apiClient.get("/settings");
    return response.data;
  },

  updateStore: async (
    payload: Partial<StoreSettings>
  ): Promise<ApiResponse<{ settings: Settings }>> => {
    const response = await apiClient.put("/settings/store", payload);
    return response.data;
  },

  updateShipping: async (
    payload: Partial<ShippingSettings>
  ): Promise<ApiResponse<{ settings: Settings }>> => {
    const response = await apiClient.put("/settings/shipping", payload);
    return response.data;
  },

  updatePayment: async (
    payload: Partial<PaymentSettings>
  ): Promise<ApiResponse<{ settings: Settings }>> => {
    const response = await apiClient.put("/settings/payment", payload);
    return response.data;
  },
};
