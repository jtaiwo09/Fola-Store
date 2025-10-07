import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";

export interface ProductAnalytics {
  totalOrders: number;
  totalRevenue: number;
  totalQuantitySold: number;
  averageOrderValue: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topVariants: Array<{
    color: string;
    quantitySold: number;
    revenue: number;
  }>;
}

export interface ProductAnalyticsResponse {
  success: boolean;
  message: string;
  data: ProductAnalytics;
}

export const useProductAnalytics = (productId: string) => {
  return useQuery({
    queryKey: ["product-analytics", productId],
    queryFn: async () => {
      const { data } = await apiClient.get<ProductAnalyticsResponse>(
        `/admin/products/${productId}/analytics`
      );
      return data.data;
    },
    enabled: !!productId,
  });
};
