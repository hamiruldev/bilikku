'use client';

import { useAuth } from '@/context/AuthContext';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <main className={user ? "pt-16" : ""}>
      {children}
    </main>
  );
} 