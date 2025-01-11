'use client';

import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePathname, useRouter } from 'next/navigation';
import { PUBLIC_ROUTES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle authentication
  useEffect(() => {
    if (!isLoading && !user && !PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  // Don't show header for public routes or when user is not authenticated
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  // Show header only for authenticated users on non-public routes
  const showHeader = user && !isPublicRoute;

  // If still loading auth state or not mounted, show loading spinner
  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AnimatePresence>
        {showHeader && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Header />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${showHeader ? "pt-16" : ""}`}
      >
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${showHeader ? "py-8" : ""}`}>
          {/* Breadcrumb (only show on authenticated routes) */}
          {showHeader && <Breadcrumb />}

          {/* Page Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Navigation Drawer Overlay */}
      <div className="lg:hidden">
        {/* Mobile menu implementation will go here */}
      </div>
    </div>
  );
} 