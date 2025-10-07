// lib/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, ReviewFilters } from "../api/reviews";
import { toast } from "sonner";

const REVIEWS_KEY = ["admin", "reviews"];

export const useReviews = (filters?: ReviewFilters) => {
  return useQuery({
    queryKey: [...REVIEWS_KEY, filters],
    queryFn: () => reviewsApi.getAll(filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: [...REVIEWS_KEY, id],
    queryFn: () => reviewsApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      reviewsApi.updatePublishStatus(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
      toast.success("Review status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update review");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
      toast.success("Review deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};
