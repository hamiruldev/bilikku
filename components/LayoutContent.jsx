'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export function LayoutContent({ children }) {
  const { user } = useAuth();

  return (
    <main className={user ? "pt-16" : ""}>
      {children}
    </main>
  );
} 