'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const initialFormData = {
  no_tenants: '',
  tenant_name: '',
  room_name: '',
  deposit: false,
  lease_start: '',
  lease_end: '',
};

export default function TenantFormPage({ params }) {
  const { pb } = useAuth();
  const router = useRouter();
  const isEditing = params.action !== 'new';

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadUsers();
    loadRooms();
    if (isEditing) {
      loadTenant();
    }
  }, [isEditing, params.action]);

  const loadUsers = async () => {
    try {
      const records = await pb.collection('usersku').getList(1, 50, {
        sort: 'name',
      });
      setUsers(records.items);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    }
  };

  const loadRooms = async () => {
    try {
      const records = await pb.collection('bilikku_rooms').getList(1, 50, {
        sort: 'name',
        filter: 'status = "available"',
      });
      setRooms(records.items);
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError('Failed to load rooms');
    }
  };

  const loadTenant = async () => {
    try {
      const record = await pb.collection('bilikku_tenants').getOne(params.action, {
        expand: 'tenant_name,room_name',
      });
      setFormData({
        no_tenants: record.no_tenants || '',
        tenant_name: record.tenant_name || '',
        room_name: record.room_name || '',
        deposit: record.deposit || false,
        lease_start: record.lease_start ? record.lease_start.split(' ')[0] : '',
        lease_end: record.lease_end ? record.lease_end.split(' ')[0] : '',
      });
    } catch (err) {
      console.error('Error loading tenant:', err);
      setError('Failed to load tenant');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        lease_start: formData.lease_start ? new Date(formData.lease_start).toISOString() : null,
        lease_end: formData.lease_end ? new Date(formData.lease_end).toISOString() : null,
      };

      if (isEditing) {
        await pb.collection('bilikku_tenants').update(params.action, data);
      } else {
        await pb.collection('bilikku_tenants').create(data);
      }

      router.push('/dashboard/tenants');
    } catch (err) {
      console.error('Error saving tenant:', err);
      setError(err.message || 'Failed to save tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/dashboard/tenants"
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Tenants
            </Link>
          </div>

          <div className="glass-card">
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">
                {isEditing ? 'Edit Tenant' : 'Add New Tenant'}
              </h1>

              {error && (
                <div className="p-4 mb-6 rounded-lg bg-destructive/10 text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tenant Number *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.no_tenants}
                      onChange={(e) =>
                        setFormData({ ...formData, no_tenants: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tenant *
                    </label>
                    <select
                      className="input-field"
                      value={formData.tenant_name}
                      onChange={(e) =>
                        setFormData({ ...formData, tenant_name: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a tenant</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Room *
                    </label>
                    <select
                      className="input-field"
                      value={formData.room_name}
                      onChange={(e) =>
                        setFormData({ ...formData, room_name: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a room</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Deposit Status
                    </label>
                    <select
                      className="input-field"
                      value={formData.deposit.toString()}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deposit: e.target.value === 'true',
                        })
                      }
                    >
                      <option value="false">Not Paid</option>
                      <option value="true">Paid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lease Start Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.lease_start ? formData.lease_start : new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, lease_start: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lease End Date
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.lease_end ? formData.lease_end : new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, lease_end: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/dashboard/tenants" className="btn-secondary">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update Tenant' : 'Create Tenant'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 