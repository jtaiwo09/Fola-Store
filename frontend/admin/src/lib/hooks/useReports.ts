// lib/hooks/admin/useReports.ts
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, QUERY_KEYS } from "../constants";
import apiClient from "../api/client";

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface SalesReportData {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  revenueOverTime: Array<{
    _id: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    productType: string;
    revenue: number;
    quantitySold: number;
    orders: number;
  }>;
  salesByCategory: Array<{
    _id: string;
    categoryName: string;
    revenue: number;
    orders: number;
    quantitySold: number;
  }>;
  salesByProductType: Array<{
    _id: string;
    revenue: number;
    orders: number;
    quantitySold: number;
  }>;
}

export interface InventoryReportData {
  summary: {
    totalProducts: number;
    totalStock: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  lowStockProducts: any[];
  outOfStockProducts: any[];
  stockValueByCategory: Array<{
    _id: string;
    categoryName: string;
    totalProducts: number;
    totalStock: number;
    stockValue: number;
  }>;
  stockValueByProductType: Array<{
    _id: string;
    totalProducts: number;
    totalStock: number;
    stockValue: number;
  }>;
}

export interface ProductPerformanceData {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  bestSellers: Array<{
    productId: string;
    productName: string;
    productType: string;
    quantitySold: number;
    revenue: number;
    orders: number;
    averageRating: number;
    reviewCount: number;
  }>;
  worstPerformers: Array<{
    productId: string;
    productName: string;
    productType: string;
    quantitySold: number;
    revenue: number;
  }>;
}

// ✅ Sales Report
export const useSalesReport = (
  dateRange?: DateRange,
  groupBy: "day" | "week" | "month" = "day"
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.REPORTS.SALES(dateRange, groupBy),
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: SalesReportData }>(
        API_ENDPOINTS.ADMIN.REPORTS.SALES,
        {
          params: { ...dateRange, groupBy },
        }
      );
      return data.data;
    },
  });
};

// ✅ Inventory Report
export const useInventoryReport = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.REPORTS.INVENTORY,
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: InventoryReportData }>(
        API_ENDPOINTS.ADMIN.REPORTS.INVENTORY
      );
      return data.data;
    },
  });
};

// ✅ Product Performance Report
export const useProductPerformanceReport = (
  dateRange?: DateRange,
  limit: number = 20
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.REPORTS.PRODUCT_PERFORMANCE(dateRange, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: ProductPerformanceData }>(
        API_ENDPOINTS.ADMIN.REPORTS.PRODUCT_PERFORMANCE,
        {
          params: { ...dateRange, limit },
        }
      );
      return data.data;
    },
  });
};
