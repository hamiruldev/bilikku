'use client';

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { LayoutContent } from '@/components/LayoutContent';

export function ClientProviders({ children }: { children: React.ReactNode }) {
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