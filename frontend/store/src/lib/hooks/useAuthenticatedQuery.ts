import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import apiClient from "../api/client";

export function useAuthenticatedQuery<TData = any, TSelect = TData>(
  queryKey: any[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, any, TSelect>, "queryKey" | "queryFn">
) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery<TData, any, TSelect>({
    queryKey,
    queryFn: async () => {
      // Wait for Clerk to load
      if (!isLoaded) {
        throw new Error("Auth not loaded");
      }

      if (!isSignedIn) {
        throw new Error("Not signed in");
      }

      const token = await getToken();

      const response = await apiClient.get(endpoint, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return response.data;
    },
    enabled: isLoaded && isSignedIn && (options?.enabled ?? true),
    retry: (failureCount, error: any) => {
      // Don't retry on 401
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
    ...options,
  });
}
