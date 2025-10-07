// apps/admin/src/lib/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "staff" | "customer";
  avatar?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) return null;
      const data = await response.json();
      return data.success ? data.data.user : null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const login = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.data.user);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    },
  });

  // Forgot password mutation
  const forgotPassword = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Reset password mutation
  const resetPassword = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${payload.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: payload.password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
      router.push("/admin/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };
};
