"use client";

import { ProductFilters, Product, CheckStockPayload } from "@/lib/api/products";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import { ApiResponse } from "../api/client";
import { usePublicQuery } from "./usePublicQuery";
import { usePublicMutation } from "./usePublicMutation";

type CheckStockVariables = {
  id: string;
  payload: CheckStockPayload;
};

type CheckStockResponse = {
  isAvailable: boolean;
  availableStock: number;
  requestedQuantity: number;
};

export const useProducts = (filters?: ProductFilters) => {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = `${API_ENDPOINTS.PRODUCTS}${
    queryString ? `?${queryString}` : ""
  }`;

  return usePublicQuery<ApiResponse<Product[]>>(
    [API_ENDPOINTS.PRODUCTS, filters],
    endpoint
  );
};

export const useProduct = (id: string) =>
  usePublicQuery<ApiResponse<{ product: Product }>, Product>(
    [API_ENDPOINTS.PRODUCT_DETAIL(id)],
    API_ENDPOINTS.PRODUCT_DETAIL(id),
    {
      enabled: !!id,
      select: (res) => res.data.product,
    }
  );

export const useProductBySlug = (slug: string) =>
  usePublicQuery<ApiResponse<{ product: Product }>, Product>(
    [API_ENDPOINTS.PRODUCT_BY_SLUG(slug)],
    API_ENDPOINTS.PRODUCT_BY_SLUG(slug),
    {
      enabled: !!slug,
      select: (res) => res.data.product,
    }
  );

export const useFeaturedProducts = (limit = 8) =>
  usePublicQuery<ApiResponse<{ products: Product[] }>, Product[]>(
    [API_ENDPOINTS.FEATURED_PRODUCTS, limit],
    `${API_ENDPOINTS.FEATURED_PRODUCTS}?limit=${limit}`,
    {
      select: (res) => res.data.products,
    }
  );

export const useNewArrivals = (limit = 8) =>
  usePublicQuery<ApiResponse<{ products: Product[] }>, Product[]>(
    [API_ENDPOINTS.NEW_ARRIVALS, limit],
    `${API_ENDPOINTS.NEW_ARRIVALS}?limit=${limit}`,
    {
      select: (res) => res.data.products,
    }
  );

export const useCheckStock = () =>
  usePublicMutation<CheckStockResponse, CheckStockVariables>({
    endpoint: (vars) => API_ENDPOINTS.CHECK_STOCK(vars.id),
    method: "POST",
    options: {
      onError: (error: any) => {
        toast.error(error.message || "Failed to check stock");
      },
    },
  });
