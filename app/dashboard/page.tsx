'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

// Stats interfaces for different roles
interface AdminStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  totalTenants: number;
  pendingPayments: number;
  monthlyRevenue: number;
}

interface TenantStats {
  roomNumber: string;
  rentDueDate: string;
  rentAmount: number;
  pendingPayments: number;
  lastPaymentDate: string;
}

export default function DashboardPage() {
  const { user, logout, isLoading, pb } = useAuth();
  const router = useRouter();
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalTenants: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
  });
  const [tenantStats, setTenantStats] = useState<TenantStats>({
    roomNumber: '',
    rentDueDate: '',
    rentAmount: 0,
    pendingPayments: 0,
    lastPaymentDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let isSubscribed = true;

    const loadDashboardData = async () => {
      try {
        if (user?.isAdmin) {


          console.log("pb---->", pb)

          // Load admin stats
          const [rooms, tenants, pendingPayments, monthlyPayments] = await Promise.all([
            pb.collection('bilikku_rooms').getList(1, 50),
            pb.collection('bilikku_tenants').getList(1, 50),
            pb.collection('bilikku_payments').getList(1, 50, {
              filter: 'status = "pending"'
            }),
            pb.collection('bilikku_payments').getList(1, 100, {
              filter: `status = "completed" && MONTH(payment_date) = ${new Date().getMonth() + 1}`
            })
          ]);

          if (isSubscribed) {
            setAdminStats({
              totalRooms: rooms.totalItems,
              occupiedRooms: rooms.items.filter(room => room.status === 'occupied').length,
              availableRooms: rooms.items.filter(room => room.status === 'available').length,
              totalTenants: tenants.totalItems,
              pendingPayments: pendingPayments.totalItems,
              monthlyRevenue: monthlyPayments.items.reduce((sum, payment) => sum + (payment.amount || 0), 0),
            });
          }
        } else {
          // Load tenant stats
          const tenant = await pb.collection('bilikku_tenants').getFirstListItem(`user_id="${user?.id}"`);
          const room = await pb.collection('bilikku_rooms').getOne(tenant.room_id);
          const payments = await pb.collection('bilikku_payments').getList(1, 10, {
            filter: `tenant_id="${tenant.id}"`,
            sort: '-payment_date'
          });

          if (isSubscribed) {
            setTenantStats({
              roomNumber: room.number,
              rentDueDate: tenant.rent_due_date,
              rentAmount: tenant.rent_amount,
              pendingPayments: payments.items.filter(p => p.status === 'pending').length,
              lastPaymentDate: payments.items[0]?.payment_date || 'No payments yet',
            });
          }
        }
      } catch (error) {
        if (isSubscribed) {
          console.error('Error loading dashboard data:', error);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    if (user) {
      loadDashboardData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [user, pb]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {user.isAdmin ? (
          // Admin Dashboard Content
          <>
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
                  { label: 'Monthly Revenue', value: `RM ${adminStats.monthlyRevenue.toFixed(2)}` },
                  { label: 'Pending', value: adminStats.pendingPayments },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
          </>
        ) : (
          // Tenant Dashboard Content
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatsCard
                icon={<HomeIcon className="w-6 h-6" />}
                title="Your Room"
                stats={[
                  { label: 'Room Number', value: tenantStats.roomNumber },
                  { label: 'Rent Amount', value: `RM ${tenantStats.rentAmount.toFixed(2)}` },
                  { label: 'Due Date', value: new Date(tenantStats.rentDueDate).toLocaleDateString() },
                ]}
              />
              <StatsCard
                icon={<CurrencyDollarIcon className="w-6 h-6" />}
                title="Payments"
                stats={[
                  { label: 'Pending Payments', value: tenantStats.pendingPayments },
                  { label: 'Last Payment', value: new Date(tenantStats.lastPaymentDate).toLocaleDateString() },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <QuickActionButton
                icon={<CurrencyDollarIcon className="w-5 h-5" />}
                label="Make Payment"
                onClick={() => router.push('/dashboard/payments/new')}
              />
              <QuickActionButton
                icon={<BellIcon className="w-5 h-5" />}
                label="Report Issue"
                onClick={() => router.push('/dashboard/maintenance/new')}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatsCard({ icon, title, stats }: { 
  icon: React.ReactNode;
  title: string; 
  stats: { label: string; value: string | number }[] 
}) {
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

function QuickActionButton({ icon, label, onClick }: { 
  icon: React.ReactNode;
  label: string; 
  onClick: () => void 
}) {
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