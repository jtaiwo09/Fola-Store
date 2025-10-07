// apps/admin/src/lib/hooks/useAdmin.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { authApi } from "../api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getStats(),
    select: (data) => data.data,
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ["admin", "low-stock"],
    queryFn: () => adminApi.getLowStockProducts(),
    select: (data) => data.data.products,
  });
};
