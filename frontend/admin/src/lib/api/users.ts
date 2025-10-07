// backend/src/lib/api/users.ts (Frontend API Client)

import { API_ENDPOINTS } from "../constants";
import apiClient, { ApiResponse, PaginatedResponse } from "./client";

export interface User {
  _id: string;
  clerkId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin" | "staff";
  addresses: Address[];
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

export const usersApi = {
  getAll: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BASE, {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<User>
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.put(
      API_ENDPOINTS.USERS.BY_ID(id),
      payload
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
    return response.data;
  },
};
