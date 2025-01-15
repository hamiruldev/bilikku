'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TenantsPage() {
  const { pb } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const records = await pb.collection('bilikku_tenants').getList(1, 50, {
        sort: '-created',
        expand: 'tenant_name,room_name',
      });
      setTenants(records.items);
      setError('');
    } catch (err) {
      console.error('Error loading tenants:', err);
      setError(err.message || 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      await pb.collection('bilikku_tenants').delete(id);
      await loadTenants();
    } catch (err) {
      console.error('Error deleting tenant:', err);
      alert(err.message || 'Failed to delete tenant');
    }
  };

  // Filter tenants based on search term
  const filteredTenants = tenants.filter((tenant) => {
    const searchString = searchTerm.toLowerCase();
    return (
      tenant.no_tenants?.toLowerCase().includes(searchString) ||
      tenant.expand?.tenant_name?.name?.toLowerCase().includes(searchString) ||
      tenant.expand?.room_name?.name?.toLowerCase().includes(searchString)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tenants</h1>
          <Link
            href="/dashboard/tenants/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Tenant
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="glass-card mb-6">
          <div className="p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tenants..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="glass-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium">Tenant No</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Room</th>
                  <th className="text-left p-4 font-medium">Lease Period</th>
                  <th className="text-left p-4 font-medium">Deposit</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="p-4">{tenant.no_tenants}</td>
                    <td className="p-4">
                      {tenant.expand?.tenant_name?.name || 'N/A'}
                    </td>
                    <td className="p-4">
                      {tenant.expand?.room_name?.name || 'N/A'}
                    </td>
                    <td className="p-4">
                      {tenant.lease_start && tenant.lease_end
                        ? `${new Date(tenant.lease_start).toLocaleDateString()} - ${new Date(tenant.lease_end).toLocaleDateString()}`
                        : 'N/A'}
                    </td>
                    <td className="p-4">
                      {tenant.deposit ? 'Paid' : 'Not Paid'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/tenants/${tenant.id}`}
                          className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tenant.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTenants.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <p className="text-muted-foreground">No tenants found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 