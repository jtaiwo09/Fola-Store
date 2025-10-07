// hooks/usePublicMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../api/client";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationConfig<TData, TVariables> {
  endpoint: string | ((vars: TVariables) => string);
  method?: HttpMethod;
  options?: UseMutationOptions<TData, any, TVariables>;
}

function shouldOmitBody(method: string, variables: any): boolean {
  return (
    method === "POST" &&
    (typeof variables === "string" ||
      typeof variables === "number" ||
      variables === undefined)
  );
}

export function usePublicMutation<TData = any, TVariables = any>({
  endpoint,
  method = "POST",
  options,
}: MutationConfig<TData, TVariables>) {
  return useMutation<TData, any, TVariables>({
    mutationFn: async (variables) => {
      const url =
        typeof endpoint === "function" ? endpoint(variables) : endpoint;

      const clientMethod = {
        POST: () =>
          shouldOmitBody(method, variables)
            ? apiClient.post(url, undefined)
            : apiClient.post(url, variables),
        PUT: () => apiClient.put(url, variables),
        PATCH: () => apiClient.patch(url, variables),
        DELETE: () => apiClient.delete(url),
      }[method];

      if (!clientMethod) throw new Error(`Unsupported method: ${method}`);

      const { data } = await clientMethod();
      return data;
    },
    ...options,
  });
}
