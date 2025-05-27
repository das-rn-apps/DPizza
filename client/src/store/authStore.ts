// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser, registerUser } from "../api/fakeApi";
import type { User } from "../api/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: Pick<User, "email" | "password">) => Promise<void>;
  register: (userData: Omit<User, "id" | "token">) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const fetchedUser = await loginUser(credentials);
          set({
            user: fetchedUser,
            token: fetchedUser.token || null,
            isAuthenticated: true,
            loading: false,
          });
          // In a real app, you'd store the token securely (e.g., HttpOnly cookie)
        } catch (err: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: err.message || "Login failed",
          });
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const newUser = await registerUser(userData);
          set({
            user: newUser,
            token: newUser.token || null,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: err.message || "Registration failed",
          });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        // Clear any stored tokens (e.g., from local storage if used, though HttpOnly is better)
      },
    }),
    {
      name: "pizza-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        console.log("Auth state rehydrated from local storage");
      },
    }
  )
);
