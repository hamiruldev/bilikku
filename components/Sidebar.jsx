'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { XMarkIcon, UserCircleIcon, HomeIcon, CogIcon, ArrowLeftOnRectangleIcon, BuildingOfficeIcon, UsersIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full glass z-50 
                  w-[80%] md:w-[40%] 
                  transform transition-transform duration-300 ease-in-out
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 px-4 flex items-center justify-between border-b border-glass-border">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-glass-border">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">

            {user?.isAdmin == false && user?.role == "guest" && (
              <>
                <Link
                  href="/bilikku"
                  className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={onClose}>
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Bilikku</span>
                </Link>
              </>
            )}


            {user?.isAdmin && (
              <>

                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/dashboard/sublets"
                  className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Sublets</span>
                </Link>

                <Link
                  href="/dashboard/rooms"
                  className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Rooms</span>
                </Link>

                <Link
                  href="/dashboard/tenants"
                  className="flex items-center space-x-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <UsersIcon className="w-5 h-5" />
                  <span>Tenants</span>
                </Link>
              </>
            )}


          </nav>
        </div>

        <div className="p-4 border-t border-glass-border space-y-4">

          <Link
            href="/profile"
            className="flex items-center justify-between space-x-2 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            onClick={onClose}
          >

            <div className="w-100 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Settings</span>
            </div>

            <CogIcon className="w-5 h-5" />

          </Link>


          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>


          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
} 