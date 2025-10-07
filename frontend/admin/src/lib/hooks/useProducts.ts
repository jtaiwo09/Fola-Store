// apps/admin/src/lib/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  ProductFilters,
  CreateProductPayload,
} from "../api/products";
import { toast } from "sonner";
import { QUERY_KEYS } from "../constants";

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.BY_ID(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.BY_SLUG(slug),
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      toast.success("Product created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateProductPayload>;
    }) => productsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS.BY_ID(variables.id),
      });
      toast.success("Product updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};

export const useFeaturedProducts = (limit?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.FEATURED,
    queryFn: () => productsApi.getFeatured(limit),
  });
};

export const useNewArrivals = (limit?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.NEW_ARRIVALS,
    queryFn: () => productsApi.getNewArrivals(limit),
  });
};

export const useBulkPublishProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productIds,
      isPublished,
    }: {
      productIds: string[];
      isPublished: boolean;
    }) => productsApi.bulkPublish(productIds, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      toast.success("Products updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update products");
    },
  });
};

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productIds: string[]) => productsApi.bulkDelete(productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      toast.success("Products deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete products");
    },
  });
};

export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productIds,
      status,
    }: {
      productIds: string[];
      status: string;
    }) => productsApi.bulkUpdateStatus(productIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      toast.success("Product status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update product status"
      );
    },
  });
};
