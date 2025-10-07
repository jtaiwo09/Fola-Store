import axios from "axios";
import { config } from "@/config/env";
import ApiError from "@/utils/ApiError";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
    };
  };
}

export const verifyPaystackPayment = async (
  reference: string
): Promise<any> => {
  try {
    const response = await axios.get<PaystackVerificationResponse>(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.data.status) {
      throw ApiError.badRequest("Payment verification failed");
    }

    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      throw ApiError.badRequest(
        error.response.data.message || "Payment verification failed"
      );
    }
    throw ApiError.internal("Payment service error");
  }
};

export const initializePaystackPayment = async (data: {
  email: string;
  amount: number;
  reference: string;
  metadata?: any;
}): Promise<any> => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: data.email,
        amount: data.amount * 100, // Convert to kobo
        reference: data.reference,
        metadata: data.metadata,
        callback_url: `${config.CLIENT_URL}/orders/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.status) {
      throw ApiError.badRequest("Payment initialization failed");
    }

    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      throw ApiError.badRequest(
        error.response.data.message || "Payment initialization failed"
      );
    }
    throw ApiError.internal("Payment service error");
  }
};

export const initializeOrderPayment = async (data: {
  email: string;
  amount: number;
  orderId: string;
  metadata?: any;
}): Promise<any> => {
  try {
    const reference = `ORD-${data.orderId}-${Date.now()}`;

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: data.email,
        amount: data.amount * 100, // Kobo
        reference,
        metadata: {
          orderId: data.orderId,
          ...data.metadata,
        },
        callback_url: `${config.CLIENT_URL}/orders/verify?reference=${reference}`,
      },
      {
        headers: {
          Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { ...response.data.data, reference };
  } catch (error: any) {
    throw ApiError.badRequest(
      error.response?.data?.message || "Payment initialization failed"
    );
  }
};
