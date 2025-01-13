'use client';

import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Sidebar } from './Sidebar';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 glass z-40 border-b border-glass-border">
        <div className="h-full container mx-auto px-4 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="text-xl md:text-2xl font-bold flex items-center space-x-2"
          >
            <span className="hidden sm:inline">BilikKu</span>
            <span className="sm:hidden">BK</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </>
  );
} 