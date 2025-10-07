import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "../api/client";
import { API_ENDPOINTS, QUERY_KEYS } from "@/lib/constants";

export interface Notification {
  _id: string;
  type: "low_stock" | "new_order" | "order_status" | "review" | "general";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
}

// Get notifications (paginated)
export const useNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.PAGINATED(page, limit),
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationsResponse>(
        API_ENDPOINTS.NOTIFICATIONS.BASE,
        {
          params: { page, limit },
        }
      );
      return data;
    },
  });
};

// Mark a single notification as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await apiClient.patch(
        API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.BASE,
      });
    },
  });
};

// Mark all notifications as read
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch(
        API_ENDPOINTS.NOTIFICATIONS.READ_ALL
      );
      return data;
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.BASE,
      });
    },
  });
};

// Delete a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await apiClient.delete(
        API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.BASE,
      });
    },
  });
};
