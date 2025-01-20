'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { roomAPI, tenantAPI } from '../../services/api';
import {
    HomeIcon,
    CurrencyDollarIcon,
    WrenchIcon,
    ClipboardIcon,
    ChatBubbleLeftIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BilikKuDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();
    const [tenantData, setTenantData] = useState(null);
    const [currentPayments, setCurrentPayments] = useState(null);
    const [activeIssues, setActiveIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    let hasLoaded = false

    const loadTenantData = async () => {
        // if (!user) {
        //     router.push('/login');
        //     return;
        // }

        // Ensure only guests can access this page
        // if (user?.role !== 'guest') {
        //     router.push('/dashboard');
        //     return;
        // }

        try {
            // Load tenant details
            const tenant = await tenantAPI.getFirstByUserId(user.id);
            if (!tenant) {
                router.push('/dashboard');
                return;
            }

            const roomDetails = await roomAPI.getOne(tenant.room_name);

            tenant.room_name = roomDetails.name

            setTenantData(tenant);

            // Load current month payments
            const payments = await tenantAPI.getCurrentMonthPayments(tenant.id);

            setCurrentPayments(payments);

            // Load active maintenance issues
            const issues = await tenantAPI.getActiveIssues(tenant.id);
            setActiveIssues(issues);

        } catch (error) {
            console.error('Error loading tenant data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (hasLoaded) {
            return;
        }

        if (user && user.role !== 'guest') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            loadTenantData();
            hasLoaded = true;
        }

    }, [user, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Background gradient circles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            </div>


            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">
                            {t('tenant.dashboard.title')}
                        </h1>
                        <Link
                            href="/profile"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            {user?.email}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Current Rental Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <HomeIcon className="h-6 w-6 text-primary mr-2" />
                            <h2 className="text-lg font-semibold">{t('tenant.dashboard.currentRental')}</h2>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-medium">{t('tenant.dashboard.room')}:</span> {tenantData?.room_name}</p>
                            <p><span className="font-medium">{t('tenant.dashboard.leaseStart')}:</span> {new Date(tenantData?.lease_start).toLocaleDateString()}</p>
                            <p><span className="font-medium">{t('tenant.dashboard.leaseEnd')}:</span> {new Date(tenantData?.lease_end).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Current Month Payments */}
                    <div className="glass-card hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <CurrencyDollarIcon className="h-6 w-6 text-primary mr-2" />
                            <h2 className="text-lg font-semibold">{t('tenant.payments.currentMonth')}</h2>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-medium">{t('tenant.payments.rental')}:</span> RM {currentPayments?.amount}</p>
                            <p><span className="font-medium">{t('tenant.payments.water')}:</span> RM {currentPayments?.water_bill}</p>
                            <p><span className="font-medium">{t('tenant.payments.electric')}:</span> RM {currentPayments?.electric_bill}</p>
                            <p className="text-lg font-bold mt-4 text-right">
                                {t('tenant.payments.total')}: RM {currentPayments?.amount}
                                <span className={`ml-2 px-2 py-1 rounded text-sm ${currentPayments?.status === "completed"
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {currentPayments?.status === "completed"
                                        ? t('tenant.payments.paid')
                                        : t('tenant.payments.unpaid')}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Active Issues */}
                    <div className="glass-card hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <WrenchIcon className="h-6 w-6 text-primary mr-2" />
                            <h2 className="text-lg font-semibold">{t('tenant.maintenance.activeIssues')}</h2>
                        </div>
                        <div className="space-y-2">
                            {activeIssues.length === 0 ? (
                                <p className="text-muted-foreground">No active issues</p>
                            ) : (
                                activeIssues.map(issue => (
                                    <div key={issue.id} className="border-b pb-2">
                                        <p className="font-medium">{issue.type}</p>
                                        <p className="text-sm text-muted-foreground">{issue.status}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => router.push('/bilikku/report')}
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <WrenchIcon className="h-5 w-5" />
                        {t('tenant.maintenance.reportIssue')}
                    </button>

                    <button
                        onClick={() => router.push('/bilikku/payments')}
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <CurrencyDollarIcon className="h-5 w-5" />
                        {t('tenant.payments.history')}
                    </button>

                    <button
                        onClick={() => router.push('/bilikku/feedback')}
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        {t('tenant.feedback.newFeedback')}
                    </button>
                </div>
            </main>
        </div>
    );
}