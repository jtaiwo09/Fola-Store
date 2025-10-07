// lib/hooks/useFilterOptions.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import { usePublicQuery } from "./usePublicQuery";
import { API_ENDPOINTS } from "../constants/api-endpoints";

export interface FilterColor {
  name: string;
  hex: string;
}

export interface FilterOptions {
  colors: FilterColor[];
  fabricTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface FilterOptionsResponse {
  success: boolean;
  message: string;
  data: FilterOptions;
}

export const useFilterOptions = () =>
  usePublicQuery<FilterOptionsResponse, FilterOptions>(
    [API_ENDPOINTS.FILTER_OPTIONS],
    API_ENDPOINTS.FILTER_OPTIONS,
    {
      staleTime: 1000 * 60 * 5,
      select: (data) => data.data,
    }
  );
