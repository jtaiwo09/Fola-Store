import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Create socket connection
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);

      // Join admin room
      socketInstance.emit("join-admin", user._id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Listen for notifications
    socketInstance.on("notification", (data) => {
      console.log("🔔 New notification:", data);

      // Show toast notification
      toast(data.title, {
        description: data.message,
        duration: 5000,
      });

      // Trigger notification refetch (if using React Query)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTIFICATIONS.PAGINATED(1, 20),
      });
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.emit("leave-admin", user._id);
        socketInstance.disconnect();
      }
    };
  }, [user?._id, isAuthenticated]);

  return { socket, isConnected };
};
