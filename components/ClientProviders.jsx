'use client';

import React from 'react';
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from './ThemeProvider';
import { Header } from './Header';
import { LayoutContent } from './LayoutContent';

export function ClientProviders({ children }) {
  debugger
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <Header />
        <LayoutContent>
          {children}
        </LayoutContent>
      </ThemeProvider>
    </AuthProvider>
  );
} 