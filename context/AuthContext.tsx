'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { superuserClient, authenticateSuperuser } from '@/lib/superuserClient';

interface User {
  id: string;
  email: string;
  role: string;
  username: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  tenantId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isSuperAdmin?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  pb: typeof pb;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserRole = async (userId: string) => {
    try {
      const user = await pb.collection('tenant_roles').getFirstListItem(`user="${userId}"`);
      const roleId = user.role;
      const Role = await pb.collection('roles').getFirstListItem(`id="${roleId}"`);

      return {
        role: Role.name,
        tenantId: 'rb0s8fazmuf44ac'
      };
    } catch (error) {
      console.error('Error checking user role:', error);
      return {
        role: 'guest',
        tenantId: 'rb0s8fazmuf44ac'
      };
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      try {
        // Try to load the auth state from the cookie

        console.log("pb.authStore---->", pb.authStore)


        if (pb.authStore.isValid) {
          const authModel = pb.authStore.model;
          if (authModel) {
            const { role, tenantId } = await checkUserRole(authModel.id);
            setUser({
              id: authModel.id,
              email: authModel.email,
              role: role,
              username: authModel.username,
              isAdmin: role === 'admin',
              isSuperAdmin: false,
              tenantId: tenantId
            });
          }
        } else if (superuserClient.authStore.isValid) {
          const superAuthModel = superuserClient.authStore.model;
          if (superAuthModel) {
            setUser({
              id: superAuthModel.id,
              email: superAuthModel.email,
              role: 'superadmin',
              username: superAuthModel.email.split('@')[0],
              isAdmin: true,
              isSuperAdmin: true,
              tenantId: 'rb0s8fazmuf44ac'
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth store change listeners
    const unsubscribe = pb.authStore.onChange(() => {
      initializeAuth();
    });

    const unsubscribeSuperuser = superuserClient.authStore.onChange(() => {
      initializeAuth();
    });

    // Initial auth check
    initializeAuth();

    // Cleanup
    return () => {
      unsubscribe?.();
      unsubscribeSuperuser?.();
    };
  }, []);

  const login = async (email: string, password: string, isSuperAdmin = false) => {
    try {
      if (isSuperAdmin) {
        const isAuthenticated = await authenticateSuperuser(email, password);
        if (isAuthenticated && superuserClient.authStore.model) {
          const authModel = superuserClient.authStore.model;
          setUser({
            id: authModel.id,
            email: authModel.email,
            role: 'superadmin',
            username: email.split('@')[0],
            isAdmin: true,
            isSuperAdmin: true,
            tenantId: 'rb0s8fazmuf44ac'
          });
          return;
        }
        throw new Error('Invalid superadmin credentials');
      }

      const authData = await pb.collection('usersku').authWithPassword(email, password);
      
      if (authData.record) {
        const { role, tenantId } = await checkUserRole(authData.record.id);
        
        setUser({
          id: authData.record.id,
          email: authData.record.email,
          role: role,
          username: authData.record.username,
          isAdmin: role === 'admin',
          isSuperAdmin: false,
          tenantId: tenantId
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    superuserClient.authStore.clear();
    setUser(null);
    // Clear cookies
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, pb }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 