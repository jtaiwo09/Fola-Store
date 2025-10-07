// lib/hooks/useStaff.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi, StaffFilters, CreateStaffPayload } from "../api/staff";
import { toast } from "sonner";

const STAFF_KEY = ["admin", "staff"];

export const useStaff = (filters?: StaffFilters) => {
  return useQuery({
    queryKey: [...STAFF_KEY, filters],
    queryFn: () => staffApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStaffPayload) => staffApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      toast.success("Staff member created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create staff member"
      );
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateStaffPayload>;
    }) => staffApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      toast.success("Staff member updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update staff member"
      );
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      toast.success("Staff member deactivated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to deactivate staff member"
      );
    },
  });
};
