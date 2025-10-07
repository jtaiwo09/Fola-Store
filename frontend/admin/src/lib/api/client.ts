import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "../constants";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor - get token from our server-side API
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Call our Next.js API route to get the token from HTTP-only cookie
      const response = await fetch("/api/auth/token", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && config.headers) {
          config.headers.Authorization = `Bearer ${data.token}`;
        }
      }
    } catch (error) {
      console.error("Failed to get token:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call our Next.js API route to refresh the token
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          // Token refreshed, retry the original request
          return apiClient(originalRequest);
        } else {
          // Refresh failed, redirect to login
          window.location.href = "/admin/login";
        }
      } catch (refreshError) {
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
  statusCode: number;
}
