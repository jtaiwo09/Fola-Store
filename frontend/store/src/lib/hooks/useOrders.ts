"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CreateOrderPayload, DashboardStats, Order } from "@/lib/api/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import { useAuthenticatedMutation } from "./useAuthenticatedMutation";
import { ApiResponse } from "../api/client";

// Type aliases
type OrderListResponse = ApiResponse<Order[]>;
type OrderResponse = ApiResponse<{ order: Order }>;

export const useMyOrders = (page = 1, limit = 10) => {
  return useAuthenticatedQuery<OrderListResponse>(
    [API_ENDPOINTS.MY_ORDERS, page, limit],
    `${API_ENDPOINTS.MY_ORDERS}?page=${page}&limit=${limit}`
  );
};

export const useOrder = (id: string) => {
  return useAuthenticatedQuery<OrderResponse, Order>(
    [API_ENDPOINTS.ORDER_DETAIL(id)],
    API_ENDPOINTS.ORDER_DETAIL(id),
    {
      select: (data) => data.data.order,
      enabled: !!id,
    }
  );
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useAuthenticatedMutation<any, CreateOrderPayload>({
    endpoint: API_ENDPOINTS.ORDERS,
    method: "POST",
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
        toast.success("Order created successfully!");
        router.push(`/orders/${data.data.order._id}`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create order");
      },
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, { reference: string }>({
    endpoint: API_ENDPOINTS.VERIFY_PAYMENT,
    method: "POST",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
        toast.success("Payment verified successfully!");
      },
      onError: (error: any) => {
        toast.error(error.message || "Payment verification failed");
      },
    },
  });
};

export const useInitializePayment = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, string>({
    endpoint: (orderId) => API_ENDPOINTS.INITIALIZE_PAYMENT(orderId),
    method: "POST",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to initialize payment");
      },
    },
  });
};

export const useDashboardStats = () => {
  return useAuthenticatedQuery<ApiResponse<DashboardStats>, DashboardStats>(
    [API_ENDPOINTS.DASHBOARD_STATS],
    API_ENDPOINTS.DASHBOARD_STATS,
    {
      select: (data) => data.data,
    }
  );
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, string>({
    endpoint: (id) => API_ENDPOINTS.CANCEL_ORDER(id),
    method: "PATCH",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.ORDERS] });
        toast.success("Order cancelled successfully");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to cancel order");
      },
    },
  });
};
