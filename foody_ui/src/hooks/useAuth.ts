import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  useLogin,
  useRegister,
  useLogout,
  useAuthStatus,
} from "../queries/auth";
import { Routes } from "../utils/constants";
import type { LoginCredentials, RegisterCredentials } from "../queries/auth";
import { extractApiError } from "../types/http";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, isError } = useAuthStatus();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (credentials: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      navigate(Routes.Dashboard);
    } catch (error) {
      // Clear any existing user data on login error
      queryClient.setQueryData(["auth", "currentUser"], null);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await registerMutation.mutateAsync(credentials);
      navigate(Routes.Dashboard);
    } catch (error) {
      // Clear any existing user data on register error
      queryClient.setQueryData(["auth", "currentUser"], null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate(Routes.Login);
    } catch {
      // Even if logout fails on server, clear local state
      queryClient.setQueryData(["auth", "currentUser"], null);
      queryClient.clear();
      navigate(Routes.Login);
    }
  };

  return {
    // Auth state
    user,
    isAuthenticated,
    isLoading,
    isError,

    // Auth actions
    login,
    register,
    logout,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,

    // Error states with proper typing
    loginError: extractApiError(loginMutation.error),
    registerError: extractApiError(registerMutation.error),
    logoutError: extractApiError(logoutMutation.error),

    // Reset functions
    clearLoginError: loginMutation.reset,
    clearRegisterError: registerMutation.reset,
    clearLogoutError: logoutMutation.reset,
  };
};
