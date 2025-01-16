'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import { superuserClient, authenticateSuperuser } from '../lib/superuserClient';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  pb: null,
  login: async () => { },
  logout: async () => { },
  register: async () => { },
  isLoading: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkUserRole = async (userId) => {
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

  const login = async (email, password, isSuperAdmin = false) => {
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

  const register = async (email, password, name, username) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        full_name: name,
        username: username
      };

      const createdUser = await pb.collection('usersku').create(data);

      // After registration, automatically log them in
      const authData = await pb.collection('usersku').authWithPassword(
        email,
        password
      );

      setUser(authData.record);
      return authData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const validateUsername = async (username) => {
    try {
      await pb.collection('usersku').getFirstListItem(`username="${username}"`);
      // If we get here, username exists
      return false;
    } catch (error) {
      if (error.status === 404) {
        // Username is available
        return true;
      }
      // Other errors
      console.error('Username validation error:', error);
      throw error;
    }
  };

  const validateEmail = async (email) => {
    try {
      await pb.collection('usersku').getFirstListItem(`email="${email}"`);
      // If we get here, email exists
      return false;
    } catch (error) {
      if (error.status === 404) {
        // Email is available
        return true;
      }
      // Other errors
      console.error('Email validation error:', error);
      throw error;
    }
  };

  const value = {
    user,
    pb,
    login,
    logout,
    register,
    validateUsername,
    validateEmail,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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