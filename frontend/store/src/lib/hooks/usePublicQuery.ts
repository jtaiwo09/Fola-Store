// hooks/usePublicQuery.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import apiClient from "../api/client";

export function usePublicQuery<TData = any, TSelect = TData>(
  queryKey: any[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, any, TSelect>, "queryKey" | "queryFn">
) {
  return useQuery<TData, any, TSelect>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get(endpoint);
      return data;
    },
    ...options,
  });
}
