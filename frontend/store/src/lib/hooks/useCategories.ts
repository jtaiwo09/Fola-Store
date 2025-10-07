// hooks/useCategories.ts
"use client";

import { Category } from "@/lib/api/categories";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { ApiResponse } from "@/lib/api/client";
import { usePublicQuery } from "./usePublicQuery";

// Type aliases
type CategoryListResponse = ApiResponse<{ categories: Category[] }>;
type CategoryResponse = ApiResponse<{ category: Category }>;

export const useCategories = (params?: {
  isActive?: boolean;
  parent?: string | null;
}) => {
  const queryKey = [API_ENDPOINTS.CATEGORIES, params];

  const queryString = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });
  }

  return usePublicQuery<CategoryListResponse, Category[]>(
    queryKey,
    `${API_ENDPOINTS.CATEGORIES}${queryString.toString() ? `?${queryString}` : ""}`,
    {
      select: (res) => res.data.categories,
    }
  );
};

export const useCategoryTree = () =>
  usePublicQuery<CategoryListResponse, Category[]>(
    [API_ENDPOINTS.CATEGORY_TREE],
    API_ENDPOINTS.CATEGORY_TREE,
    {
      select: (res) => res.data.categories,
    }
  );

export const useCategory = (id: string) =>
  usePublicQuery<CategoryResponse, Category>(
    [API_ENDPOINTS.CATEGORY_DETAIL(id)],
    API_ENDPOINTS.CATEGORY_DETAIL(id),
    {
      enabled: !!id,
      select: (res) => res.data.category,
    }
  );

// Fetch category by slug (with children from separate call)
export const useCategoryBySlug = (slug: string) => {
  const categoryQuery = usePublicQuery<CategoryResponse, Category>(
    [API_ENDPOINTS.CATEGORY_BY_SLUG(slug)],
    API_ENDPOINTS.CATEGORY_BY_SLUG(slug),
    {
      enabled: !!slug,
      select: (res) => res.data.category,
    }
  );
  const childrenQuery = usePublicQuery<CategoryListResponse, Category[]>(
    [API_ENDPOINTS.CATEGORIES, categoryQuery.data?._id],
    `${API_ENDPOINTS.CATEGORIES}?parent=${categoryQuery.data?._id}`,
    {
      select: (res) => res.data.categories,
    }
  );
  return {
    ...categoryQuery,
    data: categoryQuery.data
      ? { ...categoryQuery.data, children: childrenQuery.data || [] }
      : undefined,
    isLoading: categoryQuery.isLoading || childrenQuery.isLoading,
  };
};
