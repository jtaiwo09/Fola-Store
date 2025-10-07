"use client";

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";

interface AuthReturn {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: UserResource | null | undefined;
  getToken: (options?: any) => Promise<string | null>;
  signOut: () => Promise<void>;
  userId: string | undefined;
  email: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  imageUrl: string | undefined;
}

export function useAuth(): AuthReturn {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken, signOut } = useClerkAuth();

  return {
    isLoaded,
    isSignedIn,
    user,
    getToken,
    signOut,
    userId: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    imageUrl: user?.imageUrl,
  };
}
