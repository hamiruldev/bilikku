'use client';

import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { formatDate } from '../../../lib/helpers';
import { LoadingTable } from '../../../components/LoadingTable';
import { useDeleteTenant, useTenants } from '../../../hooks/useQueries';

// Separate component for tenant table content
function TenantsTableContent({ tenants, onDelete, t, locale }) {
    if (!tenants || tenants.length === 0) {
        return (
            <tr>
                <td colSpan="6" className="text-center py-8">
                    <p className="text-muted-foreground">{t('tenants.noTenants')}</p>
                </td>
            </tr>
        );
    }

    return tenants.map((tenant) => {
        console.log("LOV", LOV)

        const user = LOV.users.find(item => item.id == tenant.tenant_name)
        const room = LOV.rooms.find(item => item.id == tenant.room_name)


        return (
            <tr
                key={tenant.id}
                className="border-b border-border/50 last:border-0 hover:bg-secondary/5 transition-colors"
            >
                <td className="p-4">{tenant.no_tenants || t('common.notAvailable')}</td>
                <td className="p-4">
                    {user?.username || t('common.notAvailable')}
                </td>
                <td className="p-4">
                    {room?.name || t('common.notAvailable')}
                </td>
                <td className="p-4">
                    {tenant.lease_start && tenant.lease_end
                        ? `${formatDate(tenant.lease_start, locale)} - ${formatDate(tenant.lease_end, locale)}`
                        : t('common.notAvailable')}
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${tenant.deposit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tenant.deposit ? t('tenants.deposit.paid') : t('tenants.deposit.notPaid')}
                    </span>
                </td>
                <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/dashboard/tenants/${tenant.id}`}
                            className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                            title={t('common.edit')}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => onDelete(tenant.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                            title={t('common.delete')}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </td>
            </tr>
        );
    });
}

export default function TenantsPage() {
    const { t, locale } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data: tenants = [],
        isLoading,
        error
    } = useTenants();

    const deleteTenant = useDeleteTenant();

    const handleDelete = async (id) => {
        if (!confirm(t('tenants.deleteConfirm'))) return;
        try {
            await deleteTenant.mutateAsync(id);
        } catch (err) {
            console.error('Error deleting tenant:', err);
            alert(err.message || t('common.error'));
        }
    };


    if (isLoading) {
        return <LoadingTable />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-destructive">Error: {error.message}</div>
            </div>
        );
    }

    const filteredTenants = tenants.items.filter((tenant) => {
        const searchString = searchTerm.toLowerCase();
        return (
            tenant.no_tenants?.toLowerCase().includes(searchString) ||
            tenant.username?.toLowerCase().includes(searchString) ||
            tenant.room_name?.toLowerCase().includes(searchString)
        );
    });

    return (
        <div className="min-h-screen bg-background relative">
            {/* Background gradient circles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{t('tenants.title')}</h1>
                    <Link
                        href="/dashboard/tenants/new"
                        className="btn-primary inline-flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('tenants.addNew')}
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            className="input-field pl-10 w-full"
                            placeholder={t('common.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="text-left p-4 font-medium">{t('tenants.tenantNo')}</th>
                                    <th className="text-left p-4 font-medium">{t('tenants.name')}</th>
                                    <th className="text-left p-4 font-medium">{t('tenants.room')}</th>
                                    <th className="text-left p-4 font-medium">{t('tenants.leasePeriod')}</th>
                                    <th className="text-left p-4 font-medium">{t('tenants.deposit.title')}</th>
                                    <th className="text-right p-4 font-medium">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TenantsTableContent
                                    tenants={filteredTenants}
                                    onDelete={handleDelete}
                                    t={t}
                                    locale={locale}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 