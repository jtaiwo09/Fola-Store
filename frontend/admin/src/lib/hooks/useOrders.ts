// apps/admin/src/lib/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ordersApi,
  OrderFilters,
  UpdateOrderStatusPayload,
} from "../api/orders";
import { toast } from "sonner";
import { QUERY_KEYS } from "../constants";

export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.LIST(filters),
    queryFn: () => ordersApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.BY_ID(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrderStatusPayload;
    }) => ordersApi.updateStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS.BY_ID(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STATS });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.BY_ID(id) });
      toast.success("Order cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.STATS,
    queryFn: () => ordersApi.getStats(),
    staleTime: 5 * 60 * 1000,
  });
};
