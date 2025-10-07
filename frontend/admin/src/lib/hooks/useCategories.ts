// apps/admin/src/lib/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoriesApi,
  CategoryFilters,
  CreateCategoryPayload,
} from "../api/categories";
import { toast } from "sonner";
import { QUERY_KEYS } from "../constants";

export const useCategories = (filters?: CategoryFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST(filters),
    queryFn: () => categoriesApi.getAll(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.TREE,
    queryFn: () => categoriesApi.getTree(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.BY_ID(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCategoryPayload>;
    }) => categoriesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CATEGORIES.BY_ID(variables.id),
      });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};
