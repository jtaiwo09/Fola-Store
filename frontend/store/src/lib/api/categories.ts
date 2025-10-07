import apiClient, { ApiResponse } from "./client";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  level: number;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  // Get all categories
  getCategories: async (params?: {
    isActive?: boolean;
    parent?: string | null;
  }): Promise<ApiResponse<{ categories: Category[] }>> => {
    const response = await apiClient.get("/categories", { params });
    return response.data;
  },

  // Get category tree
  getCategoryTree: async (): Promise<
    ApiResponse<{ categories: Category[] }>
  > => {
    const response = await apiClient.get("/categories/tree");
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (
    id: string
  ): Promise<ApiResponse<{ category: Category }>> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (
    slug: string
  ): Promise<ApiResponse<{ category: Category }>> => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },
};
