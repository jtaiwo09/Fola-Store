// apps/admin/src/lib/api/orders.ts
import { API_ENDPOINTS } from "../constants";
import apiClient, { ApiResponse, PaginatedResponse } from "./client";

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  payment: PaymentDetails;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  fulfillmentStatus: "unfulfilled" | "partially_fulfilled" | "fulfilled";
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  variant: {
    sku: string;
    color: string;
    colorHex: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitOfMeasure: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  method: "paystack" | "bank_transfer" | "cash_on_delivery";
  transactionId?: string;
  reference: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
  paidAt?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
  paymentStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderStatusPayload {
  status: Order["status"];
  trackingNumber?: string;
  carrier?: string;
}

export const ordersApi = {
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE, {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  updateStatus: async (
    id: string,
    payload: UpdateOrderStatusPayload
  ): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.patch(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
      payload
    );
    return response.data;
  },

  cancel: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.patch(API_ENDPOINTS.ORDERS.CANCEL(id));
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<{ stats: any }>> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.STATS);
    return response.data;
  },
};
