'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
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
  pb: PocketBase;
}

const pb = new PocketBase('https://hamirulhafizal.pockethost.io');

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserRole = async (userId: string) => {
    try {

      const user = await pb.collection('tenant_roles').getFirstListItem(`user="${userId}"`);

      const roleId = user.role

      const Role = await pb.collection('roles').getFirstListItem(`id="${roleId}"`);

      return {
        role: Role.name,
        tenantId: null
      };


      
      // if (userRole) {
      //   try {
      //     const tenant = await pb.collection('bilikku_tenants').getFirstListItem(`user_id="${userId}"`);
      //     return {
      //       role: userRole.role,
      //       tenantId: tenant?.id || null
      //     };
      //   } catch (error) {
      //     return {
      //       role: userRole.role,
      //       tenantId: null
      //     };
      //   }
      // }

      // const adminEmails = ['admin@bilikku.com', 'hafizal@bilikku.com'];
      // const userData = pb.authStore.model;
      
      // if (userData && adminEmails.includes(userData.email)) {
      //   return {
      //     role: 'admin',
      //     tenantId: null
      //   };
      // }

      // return {
      //   role: 'guest',
      //   tenantId: null
      // };

    } catch (error) {
      console.error('Error checking user role:', error);
      return {
        role: 'guest',
        tenantId: null
      };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        pb.authStore.loadFromCookie(document?.cookie ?? '');
        superuserClient.authStore.loadFromCookie(document?.cookie ?? '');
        
        const authModel = pb.authStore.model || superuserClient.authStore.model;
        
        if (authModel) {
          const { role, tenantId } = await checkUserRole(authModel.id);
          
          setUser({
            id: authModel.id,
            email: authModel.email,
            role: role,
            username: authModel.username,
            isAdmin: role === 'admin',
            isSuperAdmin: !!superuserClient.authStore.isValid,
            tenantId: tenantId
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Add console log for debugging
  console.log('AuthProvider state:', { user, isLoading });

  useEffect(() => {
    pb.authStore.onChange(() => {
      document.cookie = pb.authStore.exportToCookie();
    });

    superuserClient.authStore.onChange(() => {
      document.cookie = superuserClient.authStore.exportToCookie();
    });
  }, []);

  const login = async (email: string, password: string, isSuperAdmin = false) => {
    try {
      if (isSuperAdmin) {
        const isAuthenticated = await authenticateSuperuser(email, password);
        if (isAuthenticated) {
          const authModel = superuserClient.authStore.model;
          setUser({
            id: authModel.id,
            email: authModel.email,
            role: 'superadmin',
            username: email.split('@')[0],
            isAdmin: true,
            isSuperAdmin: true
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
          tenantId: 'rb0s8fazmuf44ac'
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