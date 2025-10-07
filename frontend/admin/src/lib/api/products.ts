// apps/admin/src/lib/api/products.ts
import { API_ENDPOINTS } from "../constants";
import apiClient, { ApiResponse, PaginatedResponse } from "./client";

export interface IProductMetadata {
  shippingTime?: string; // e.g., "2-3 business days"
  returnPolicy?: string; // e.g., "30-day return policy"
  warranty?: string; // e.g., "1-year manufacturer warranty"
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  productType: "fabric" | "readymade" | "accessory" | "other";
  basePrice: number;
  salePrice: number;
  currency: string;
  fabricType?: string;
  unitOfMeasure: "yard" | "meter" | "piece" | "set";
  minimumOrder?: number;
  maximumOrder?: number;
  variants: ProductVariant[];
  specifications: Record<string, any>;
  totalStock: number;
  featuredImage: string;
  images: string[];
  status: "draft" | "active" | "archived" | "out_of_stock";
  isPublished: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  discountPercentage: number;
  badge?: string;
  createdAt: string;
  updatedAt: string;
  metadata: IProductMetadata;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
}

export interface ProductVariant {
  sku: string;
  color: string;
  colorHex: string;
  images: string[];
  stock: number;
  price?: number;
  isAvailable: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  fabricType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: string;
  isPublished?: boolean;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  tags?: string[];
  productType?: "fabric" | "readymade" | "accessory" | "other";
  basePrice: number;
  salePrice?: number;
  currency?: string;
  fabricType?: string;
  unitOfMeasure?: "yard" | "meter" | "piece" | "set";
  minimumOrder?: number;
  maximumOrder?: number;
  variants: Omit<ProductVariant, "_id">[];
  specifications?: Record<string, any>;
  featuredImage: string;
  images: string[];
  status?: "draft" | "active" | "archived" | "out_of_stock";
  isPublished?: boolean;
  isFeatured?: boolean;
  trackInventory: boolean;
  allowBackorder: boolean;
  lowStockThreshold: number;
}

export const productsApi = {
  getAll: async (
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  getBySlug: async (
    slug: string
  ): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  create: async (
    payload: CreateProductPayload
  ): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateProductPayload>
  ): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.put(
      API_ENDPOINTS.PRODUCTS.BY_ID(id),
      payload
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  getFeatured: async (
    limit?: number
  ): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED, {
      params: { limit },
    });
    return response.data;
  },

  getNewArrivals: async (
    limit?: number
  ): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS, {
      params: { limit },
    });
    return response.data;
  },

  checkStock: async (
    id: string,
    payload: { color: string; quantity: number }
  ): Promise<
    ApiResponse<{
      isAvailable: boolean;
      availableStock: number;
      requestedQuantity: number;
    }>
  > => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTS.CHECK_STOCK(id),
      payload
    );
    return response.data;
  },

  bulkPublish: async (
    productIds: string[],
    isPublished: boolean
  ): Promise<ApiResponse<{ updatedCount: number }>> => {
    const response = await apiClient.patch("/products/bulk/publish", {
      productIds,
      isPublished,
    });
    return response.data;
  },

  bulkDelete: async (
    productIds: string[]
  ): Promise<ApiResponse<{ deletedCount: number }>> => {
    const response = await apiClient.delete("/products/bulk", {
      data: { productIds },
    });
    return response.data;
  },

  bulkUpdateStatus: async (
    productIds: string[],
    status: string
  ): Promise<ApiResponse<{ updatedCount: number }>> => {
    const response = await apiClient.patch("/products/bulk/status", {
      productIds,
      status,
    });
    return response.data;
  },
};
