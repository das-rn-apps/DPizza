// src/hooks/useAuth.ts
import type { User } from "../api/types";
import { useAuthStore } from "../store/authStore";

interface UseAuthResult {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  login: (credentials: Pick<User, "email" | "password">) => Promise<void>;
  register: (userData: Omit<User, "id" | "token">) => Promise<void>;
  logout: () => void;
}

/**
 * Custom hook to easily access and manage authentication state and actions.
 */
export const useAuth = (): UseAuthResult => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  } = useAuthStore();

  return {
    isAuthenticated,
    user,
    loading,
    token,
    error,
    login,
    register,
    logout,
  };
};
