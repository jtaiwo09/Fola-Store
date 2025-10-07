// hooks/useAuthenticatedMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
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

export function useAuthenticatedMutation<TData = any, TVariables = any>({
  endpoint,
  method = "POST",
  options,
}: MutationConfig<TData, TVariables>) {
  const { getToken } = useAuth();

  return useMutation<TData, any, TVariables>({
    mutationFn: async (variables) => {
      const token = await getToken();
      if (!token) throw new Error("Missing auth token");

      const url =
        typeof endpoint === "function" ? endpoint(variables) : endpoint;

      const isFormData = variables instanceof FormData;

      // Only set Content-Type if not FormData
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      };

      // Choose method
      const clientMethod = {
        POST: () =>
          shouldOmitBody(method, variables)
            ? apiClient.post(url, undefined, { headers })
            : apiClient.post(url, variables, { headers }),
        PUT: () => apiClient.put(url, variables, { headers }),
        PATCH: () => apiClient.patch(url, variables, { headers }),
        DELETE: () => apiClient.delete(url, { headers }),
      }[method];

      if (!clientMethod) throw new Error(`Unsupported method: ${method}`);

      const { data } = await clientMethod();
      return data;
    },
    ...options,
  });
}
