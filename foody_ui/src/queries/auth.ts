import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import httpClient from "../lib/http-client";
import { HttpStatus, StaleTime } from "../utils/constants";
import { type User } from "../types/http";

// Auth Types
export interface LoginCredentials {
  emailAddress: string;
  password: string;
}

export interface RegisterCredentials {
  emailAddress: string;
  password: string;
  passwordConfirmation: string;
}

// Query Keys
const authKeys = {
  currentUser: ["auth", "currentUser"] as const,
} as const;

// Current User Query
export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await httpClient.get<User>("/me");
        return response.data;
      } catch (error: any) {
        // If unauthorized, return null (user not logged in)
        if (error.status === HttpStatus.Unauthorized) {
          return null;
        }
        throw error;
      }
    },
    staleTime: StaleTime.Medium,
    retry: (failureCount: number, error: any) => {
      // Don't retry unauthorized requests
      if (error?.status === HttpStatus.Unauthorized) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Login Mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<User> => {
      const response = await httpClient.post<User>("/session", credentials);
      const user = response.data;

      // Update the current user cache on successful login
      queryClient.setQueryData(authKeys.currentUser, user);

      return user;
    },
  });
};

// Register Mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials): Promise<User> => {
      const response = await httpClient.post<User>("/users", credentials);
      const user = response.data;

      // Update the current user cache on successful registration
      queryClient.setQueryData(authKeys.currentUser, user);

      return user;
    },
  });
};

// Logout Mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await httpClient.delete("/session");

      // Clear all auth-related data on successful logout
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.clear();
    },
  });
};

// Helper hook to get auth status
export const useAuthStatus = () => {
  const { data: user, isLoading, isError, error } = useUserProfile();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    error,
  };
};
