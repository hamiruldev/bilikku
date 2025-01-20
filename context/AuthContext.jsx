'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import { superuserClient } from '../lib/superuserClient';
import { useRouter } from 'next/navigation';
import { authAPI } from '../services/api';

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

  let hasLoaded = false;

  // Initialize auth state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      try {

        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);

        if (window.location.pathname == '/login' && localStorage.getItem('isAdmin') != null && localStorage.getItem('isAdmin') === "true") {
          router.replace('/dashboard/');
        }

        if (window.location.pathname == '/login' && localStorage.getItem('isAdmin') != null && localStorage.getItem('isAdmin') === "false") {
          router.replace('/bilikku/');
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

    if (hasLoaded) {
      return;
    }

    if (localStorage.getItem("isAdmin") != null) {
      initializeAuth();
      hasLoaded = true;
    }


    // Cleanup
    return () => {
      unsubscribe?.();
      unsubscribeSuperuser?.();
    };
  }, []);

  const login = async (email, password, isSuperAdmin = false) => {
    try {
      const userData = await authAPI.login(email, password, isSuperAdmin);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const register = async (email, password, name, username) => {
    try {
      const authData = await authAPI.register(email, password, name, username);
      setUser(authData.record);
      return authData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const value = {
    user,
    pb,
    login,
    logout,
    register,
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