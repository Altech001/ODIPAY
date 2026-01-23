import { ReactNode, useEffect } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('[ProtectedRoute] Check:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-brand-600">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/auth/sign-in" />;
  }

  return <>{children}</>;
}
