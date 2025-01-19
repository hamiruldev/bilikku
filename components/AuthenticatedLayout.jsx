'use client';

import { Header } from '../components/Header';
import { Breadcrumb } from '../components/Breadcrumb';
import { usePathname } from 'next/navigation';
import { AUTHENTICATED_ROUTES, PUBLIC_ROUTES } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthenticatedLayout({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Header visibility logic
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTHENTICATED_ROUTES.some(route => pathname.startsWith(route));

  const showHeader = user && (
    (user.role === 'admin') ||
    (user.role === 'guest')
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AnimatePresence>
        {showHeader && isAuthRoute && (
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
      <main className={`transition-all duration-300 ${showHeader ? "pt-16" : ""}`}>
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${showHeader ? "py-8" : ""}`}>
          {/* Breadcrumb */}
          {showHeader && isAuthRoute && <Breadcrumb />}

          {/* Page Content */}
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
    </div>
  );
} 