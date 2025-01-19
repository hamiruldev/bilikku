'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { tenantAPI, paymentAPI } from '../../../services/api';
import { 
    HomeIcon, 
    CurrencyDollarIcon, 
    WrenchIcon, 
    ClipboardIcon,
    ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';

export default function TenantDashboard() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [tenantData, setTenantData] = useState(null);
    const [currentPayments, setCurrentPayments] = useState(null);
    const [activeIssues, setActiveIssues] = useState([]);
    const [cleaningSchedule, setCleaningSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTenantData = async () => {
            try {
                // Load tenant details
                const tenant = await tenantAPI.getFirstByUserId(user.id);
                setTenantData(tenant);

                // Load current month payments
                const payments = await paymentAPI.getCurrentMonthPayments(tenant.id);
                setCurrentPayments(payments);

                // Load active maintenance issues
                const issues = await maintenanceAPI.getActiveIssues(tenant.id);
                setActiveIssues(issues);

                // Load cleaning schedule
                const schedule = await cleaningAPI.getSchedule(tenant.id);
                setCleaningSchedule(schedule);
            } catch (error) {
                console.error('Error loading tenant data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadTenantData();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Current Rental Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
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
                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <CurrencyDollarIcon className="h-6 w-6 text-primary mr-2" />
                        <h2 className="text-lg font-semibold">{t('tenant.payments.currentMonth')}</h2>
                    </div>
                    <div className="space-y-2">
                        <p><span className="font-medium">{t('tenant.payments.rental')}:</span> RM {currentPayments?.rental_amount}</p>
                        <p><span className="font-medium">{t('tenant.payments.water')}:</span> RM {currentPayments?.water_bill}</p>
                        <p><span className="font-medium">{t('tenant.payments.electric')}:</span> RM {currentPayments?.electric_bill}</p>
                        <p className="text-lg font-bold mt-4">
                            {t('tenant.payments.total')}: RM {currentPayments?.total_amount}
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                currentPayments?.status === 'paid' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {currentPayments?.status === 'paid' 
                                    ? t('tenant.payments.paid') 
                                    : t('tenant.payments.unpaid')}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Active Issues */}
                <div className="card p-6">
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

                {/* Cleaning Schedule */}
                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <ClipboardIcon className="h-6 w-6 text-primary mr-2" />
                        <h2 className="text-lg font-semibold">{t('tenant.cleaning.nextDuty')}</h2>
                    </div>
                    <div className="space-y-2">
                        {cleaningSchedule[0] && (
                            <>
                                <p><span className="font-medium">{t('tenant.cleaning.date')}:</span> {new Date(cleaningSchedule[0].date).toLocaleDateString()}</p>
                                <p><span className="font-medium">{t('tenant.cleaning.area')}:</span> {cleaningSchedule[0].area}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                    onClick={() => router.push('/dashboard/tenant/report')}
                    className="btn-secondary flex items-center justify-center gap-2"
                >
                    <WrenchIcon className="h-5 w-5" />
                    {t('tenant.maintenance.reportIssue')}
                </button>
                
                <button 
                    onClick={() => router.push('/dashboard/tenant/payments')}
                    className="btn-secondary flex items-center justify-center gap-2"
                >
                    <CurrencyDollarIcon className="h-5 w-5" />
                    {t('tenant.payments.history')}
                </button>

                <button 
                    onClick={() => router.push('/dashboard/tenant/feedback')}
                    className="btn-secondary flex items-center justify-center gap-2"
                >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    {t('tenant.feedback.newFeedback')}
                </button>
            </div>
        </div>
    );
} 