// apps/admin/src/lib/api/categories.ts
import { API_ENDPOINTS } from "../constants";
import apiClient, { ApiResponse } from "./client";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  level: number;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  children?: Category[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilters {
  isActive?: boolean;
  parent?: string | "null";
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  level?: number;
  image?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const categoriesApi = {
  getAll: async (
    filters?: CategoryFilters
  ): Promise<ApiResponse<{ categories: Category[] }>> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE, {
      params: filters,
    });
    return response.data;
  },

  getTree: async (): Promise<ApiResponse<{ categories: Category[] }>> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ category: Category }>> => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },

  getBySlug: async (
    slug: string
  ): Promise<ApiResponse<{ category: Category }>> => {
    const response = await apiClient.get(
      API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)
    );
    return response.data;
  },

  create: async (
    payload: CreateCategoryPayload
  ): Promise<ApiResponse<{ category: Category }>> => {
    const response = await apiClient.post(
      API_ENDPOINTS.CATEGORIES.BASE,
      payload
    );
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateCategoryPayload>
  ): Promise<ApiResponse<{ category: Category }>> => {
    const response = await apiClient.put(
      API_ENDPOINTS.CATEGORIES.BY_ID(id),
      payload
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },
};
