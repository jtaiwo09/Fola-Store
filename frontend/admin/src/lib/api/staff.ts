// lib/api/staff.ts
import apiClient, { ApiResponse, PaginatedResponse } from "./client";

export interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "admin" | "staff";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin" | "staff";
}

export const staffApi = {
  getAll: async (
    filters?: StaffFilters
  ): Promise<PaginatedResponse<StaffMember>> => {
    const response = await apiClient.get("/admin/staff", {
      params: filters,
    });
    return response.data;
  },

  create: async (
    payload: CreateStaffPayload
  ): Promise<ApiResponse<StaffMember>> => {
    const response = await apiClient.post("/admin/staff", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateStaffPayload>
  ): Promise<ApiResponse<StaffMember>> => {
    const response = await apiClient.patch(`/admin/staff/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/staff/${id}`);
    return response.data;
  },
};
