// lib/hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../api/settings";
import { toast } from "sonner";

const SETTINGS_KEY = ["settings"];

export const useSettings = () => {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => settingsApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateStoreSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => settingsApi.updateStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast.success("Store settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update store settings"
      );
    },
  });
};

export const useUpdateShippingSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => settingsApi.updateShipping(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast.success("Shipping settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update shipping settings"
      );
    },
  });
};

export const useUpdatePaymentSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => settingsApi.updatePayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
      toast.success("Payment settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update payment settings"
      );
    },
  });
};
