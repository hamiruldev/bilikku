'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { PUBLIC_ROUTES, AUTHORIZATION_ROUTES } from '../lib/constants';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Allow access to public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsAuthorized(true);
      return;
    }

    // If no user, show unauthorized
    if (!user?.role) {
      setIsAuthorized(false);
      return;
    }

    // Find authorization rules for user role
    const userAuthRules = AUTHORIZATION_ROUTES.find(route => route.role === user.role);

    if (!userAuthRules) {
      setIsAuthorized(false);
      return;
    }

    // Check if current path is allowed
    const isAllowedRoute = userAuthRules.allowRouteStartWith.some(prefix =>
      pathname.startsWith(prefix)
    );

    setIsAuthorized(isAllowedRoute);

  }, [pathname, user]);

  const handleRedirect = () => {
    if (user?.role === 'guest') {
      router.push('/bilikku');
    } else if (user?.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  if (!isAuthorized) {

    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full px-4">
          <div className="text-center">
            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="mt-4 text-3xl font-bold text-foreground">
              Not Authorized
            </h1>
            <p className="mt-2 text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <button
              onClick={handleRedirect}
              className="mt-6 btn-primary inline-flex items-center"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}