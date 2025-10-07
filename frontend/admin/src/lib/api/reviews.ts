// lib/api/reviews.ts
import { API_ENDPOINTS } from "../constants";
import apiClient, { ApiResponse, PaginatedResponse } from "./client";

export interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    featuredImage: string;
  };
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  order?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  sort?: string;
  productId?: string;
  isPublished?: boolean;
  rating?: number;
}

export const reviewsApi = {
  getAll: async (
    filters?: ReviewFilters
  ): Promise<PaginatedResponse<Review>> => {
    // This would need a new admin endpoint: GET /admin/reviews
    const response = await apiClient.get("/admin/reviews", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ review: Review }>> => {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BY_ID(id));
    return response.data;
  },

  updatePublishStatus: async (
    id: string,
    isPublished: boolean
  ): Promise<ApiResponse<{ review: Review }>> => {
    const response = await apiClient.patch(`/admin/reviews/${id}/publish`, {
      isPublished,
    });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id));
    return response.data;
  },
};
