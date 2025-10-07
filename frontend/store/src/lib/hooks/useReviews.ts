import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { usePublicQuery } from "./usePublicQuery";
import { useAuthenticatedMutation } from "./useAuthenticatedMutation";

export interface Review {
  _id: string;
  product: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  order?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulVotes: string[];
  notHelpfulVotes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReviewPayload {
  product: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

// Get product reviews
export const useProductReviews = (
  productId: string,
  page: number = 1,
  limit: number = 10
) => {
  const endpoint = `${API_ENDPOINTS.PRODUCT_REVIEWS(
    productId
  )}?page=${page}&limit=${limit}`;

  return usePublicQuery<ReviewsResponse>(
    [API_ENDPOINTS.PRODUCT_REVIEWS(productId), page, limit],
    endpoint,
    { enabled: !!productId }
  );
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, CreateReviewPayload>({
    endpoint: API_ENDPOINTS.CREATE_REVIEW,
    method: "POST",
    options: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PRODUCT_REVIEWS(variables.product)],
        });
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PRODUCTS, variables.product],
        });
        toast.success("Review submitted successfully!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to submit review");
      },
    },
  });
};

// Vote review helpful
export const useVoteReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, string>({
    endpoint: (reviewId) => API_ENDPOINTS.VOTE_HELPFUL(reviewId),
    method: "POST",
    options: {
      onSuccess: (data) => {
        toast.success("Marked as helpful");
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PRODUCT_REVIEWS(data.data.review.product)],
        });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to vote");
      },
    },
  });
};

// Vote review not helpful
export const useVoteReviewNotHelpful = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, string>({
    endpoint: (reviewId) => API_ENDPOINTS.VOTE_NOT_HELPFUL(reviewId),
    method: "POST",
    options: {
      onSuccess: (data) => {
        toast.success("Marked as not helpful");
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PRODUCT_REVIEWS(data.data.review.product)],
        });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to vote");
      },
    },
  });
};

// Remove vote
export const useRemoveReviewVote = () => {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation<any, any>({
    endpoint: (reviewId) => API_ENDPOINTS.REMOVE_VOTE(reviewId),
    method: "DELETE",
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PRODUCT_REVIEWS(data.data.review.product)],
        });
        toast.success("Vote removed");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to remove vote");
      },
    },
  });
};

// Check if user can review
export const useCanReview = (productId: string) => {
  return useAuthenticatedQuery(
    [API_ENDPOINTS.CAN_REVIEW(productId)],
    API_ENDPOINTS.CAN_REVIEW(productId),
    { enabled: !!productId }
  );
};

export const useUploadReviewImages = () => {
  return useAuthenticatedMutation<any, FormData>({
    endpoint: API_ENDPOINTS.UPLOAD_REVIEW_IMAGES,
    method: "POST",
    options: {
      onSuccess: () => {
        toast.success("Images uploaded successfully");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to submit review");
      },
    },
  });
};
