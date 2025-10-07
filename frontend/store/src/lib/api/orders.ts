import apiClient, { ApiResponse } from "./client";
import { Address } from "./auth";

export interface Order {
  _id: string;
  orderNumber: string;
  customer: string;
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
  shippedAt: string;
  deliveredAt: string;
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

export interface PaymentDetails {
  method: "paystack" | "bank_transfer" | "cash_on_delivery";
  transactionId?: string;
  reference: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
  paidAt?: string;
}

export interface CreateOrderPayload {
  items: {
    product: string;
    variant: {
      sku: string;
      color: string;
      colorHex: string;
    };
    quantity: number;
  }[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentReference: string;
}

export interface DashboardStats {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSpent: number;
  };
  recentOrders: Order[];
}

export const ordersApi = {
  // Create new order
  createOrder: async (
    payload: CreateOrderPayload
  ): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.post("/orders", payload);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (page = 1, limit = 10): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get("/orders/my-orders", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single order
  getOrderById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (
    reference: string
  ): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.post("/orders/verify-payment", {
      reference,
    });
    return response.data;
  },

  initializePayment: async (
    orderId: string
  ): Promise<
    ApiResponse<{
      authorizationUrl: string;
      accessCode: string;
      reference: string;
    }>
  > => {
    const response = await apiClient.post(
      `/orders/${orderId}/initialize-payment`
    );
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<
    ApiResponse<{
      stats: {
        totalOrders: number;
        pendingOrders: number;
        completedOrders: number;
        totalSpent: number;
      };
      recentOrders: Order[];
    }>
  > => {
    const response = await apiClient.get("/orders/dashboard/stats");
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.patch(`/orders/${id}/cancel`);
    return response.data;
  },
};
