import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentUser } from '../lib/api';
import { apiClient } from '../lib/api';

/**
 * Authentication Store
 * Manages user authentication state with cookie-based session auth
 * Cookies are automatically handled by the browser - no need to store tokens
 */

interface AuthState {
  // State
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: CurrentUser) => void;
  updateProfile: (name?: string, image?: string) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Check if user is authenticated (call /auth/me)
      checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          // Add a timeout to prevent absolute hangs if network or proxy fails
          const userPromise = apiClient.getCurrentUser();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timed out')), 8000)
          );
          
          const user = (await Promise.race([userPromise, timeoutPromise])) as CurrentUser;
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          console.error('Initial auth check failed:', err);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Sign up
      signUp: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.signUp({ email, password, name });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          // Cookies are automatically set by the browser
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Sign up failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Sign in
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.signIn({ email, password });
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          // Cookies are automatically set by the browser
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Sign in failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.signOut();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          // Cookies are automatically cleared by the server
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Sign out failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Set user
      setUser: (user: CurrentUser) => {
        set({ user, isAuthenticated: true });
      },

      // Update profile
      updateProfile: async (name?: string, image?: string) => {
        set({ isLoading: true, error: null });
        try {
          const updated = await apiClient.updateProfile({ name, image });
          set({ user: updated, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update profile';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Register unauthenticated callback to clear state on session loss
apiClient.setOnUnauthenticated(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
