// apps/admin/src/lib/api/admin.ts
import apiClient, { ApiResponse } from "./client";

export interface AdminStats {
  revenue: {
    current: number;
    change: number;
  };
  orders: {
    current: number;
    change: number;
    pending: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  customers: {
    current: number;
    change: number;
  };
  recentOrders: any[];
}

export const adminApi = {
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  getLowStockProducts: async (): Promise<ApiResponse<{ products: any[] }>> => {
    const response = await apiClient.get("/admin/low-stock");
    return response.data;
  },
};
