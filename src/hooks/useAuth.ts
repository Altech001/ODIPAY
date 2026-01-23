import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook for authentication checks and user data fetching
 * Uses cookie-based session auth - no localStorage token handling needed
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  // Check if user is authenticated on mount
  useEffect(() => {
    // Only check if we are not already loading and haven't verified yet
    if (!isLoading && !isAuthenticated) {
      checkAuth();
    }
  }, [isLoading, isAuthenticated, checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}

/**
 * Hook to check if user is authenticated
 * Useful for protecting routes
 */
export function useIsAuthenticated() {
  const { isAuthenticated, isLoading } = useAuthStore();
  return { isAuthenticated, isLoading };
}

/**
 * Hook to get auth store methods
 */
export function useAuthActions() {
  const { signIn, signUp, signOut, updateProfile, checkAuth } = useAuthStore();
  return { signIn, signUp, signOut, updateProfile, checkAuth };
}
