import { useUserProfile } from "../queries/auth";

export const useCurrentUser = () => {
  const { data: user, isLoading, isError } = useUserProfile();

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
  };
};
