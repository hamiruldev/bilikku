'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';

export default function DashboardPage() {
  // Early guest check - before any hooks or rendering
  if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') !== 'true') {
    // window.location.href = '/bilikku';
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const hasLoadedRef = useRef(false);
  const [adminStats, setAdminStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalTenants: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
  });
  const [tenantStats, setTenantStats] = useState({
    roomNumber: '',
    rentDueDate: '',
    rentAmount: 0,
    pendingPayments: 0,
    lastPaymentDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Check for admin access
  useEffect(() => {
    // Wait for auth to be ready
    if (isLoading) return;

    // Then check user object when it's available
    if (!user) {
      router.replace('/login');
      return;
    }

    setInitializing(false);
  }, [user, isLoading, router]);

  // Load dashboard data
  useEffect(() => {
    if (isLoading || !user || hasLoadedRef.current) return;

    let isSubscribed = true;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const stats = await dashboardAPI.getAdminStats();
        if (isSubscribed) {
          setAdminStats(stats);
          setError(null);
          hasLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        if (isSubscribed) {
          setError(error?.message || 'Failed to load dashboard data');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isSubscribed = false;
    };
  }, [user, isLoading]);

  // Reset hasLoaded ref when component unmounts
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
    };
  }, []);

  // Don't render anything until we know the user's role
  if (initializing) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<HomeIcon className="w-6 h-6" />}
            title="Rooms"
            stats={[
              { label: 'Total', value: adminStats.totalRooms },
              { label: 'Occupied', value: adminStats.occupiedRooms },
              { label: 'Available', value: adminStats.availableRooms },
            ]}
          />
          <StatsCard
            icon={<UsersIcon className="w-6 h-6" />}
            title="Tenants"
            stats={[
              { label: 'Total', value: adminStats.totalTenants },
              { label: 'Active', value: adminStats.occupiedRooms },
            ]}
          />
          <StatsCard
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            title="Payments"
            stats={[
              { label: 'Monthly Revenue', value: `RM ${adminStats.monthlyRevenue?.toFixed(2)}` },
              { label: 'Pending', value: adminStats.pendingPayments },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

          <QuickActionButton
            icon={<BuildingOfficeIcon className="w-5 h-5" />}
            label="Add Sublet"
            onClick={() => router.push('/dashboard/sublets/new')}
          />
          <QuickActionButton
            icon={<HomeIcon className="w-5 h-5" />}
            label="Add Room"
            onClick={() => router.push('/dashboard/rooms/new')}
          />
          <QuickActionButton
            icon={<UsersIcon className="w-5 h-5" />}
            label="Add Tenant"
            onClick={() => router.push('/dashboard/tenants/new')}
          />
          <QuickActionButton
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
            label="Record Payment"
            onClick={() => router.push('/dashboard/payments/new')}
          />
          <QuickActionButton
            icon={<ChartBarIcon className="w-5 h-5" />}
            label="View Reports"
            onClick={() => router.push('/dashboard/reports')}
          />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, title, stats }) {
  return (
    <div className="glass-card hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-muted-foreground">{stat.label}</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card flex flex-col items-center justify-center p-6 
                 hover:bg-primary/5 hover:-translate-y-1 
                 active:translate-y-0 
                 transition-all duration-300 gap-3"
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
} 