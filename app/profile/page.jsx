'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline';
import { userAPI } from '../../services/api';

const initialProfile = {
  avatar_url: '',
  name: '',
  phone: '',
  bio: '',
  no_ic: '',
  bank_details: {
    bank_name: '',
    account_number: '',
    account_holder: '',
  }
};

export default function ProfilePage() {
  const { user, pb } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const record = await userAPI.getProfile(user.id);
        const referal_name = await userAPI.getUsername(record.referal_code)

        setProfile({
          ...record,
          referal_name,
          bank_details: record.bank_details
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (key === 'bank_details') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      await userAPI.updateProfile(user.id, formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: error?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const record = await userAPI.updateProfile(user.id, formData);
      setProfile(prev => ({ ...prev, avatar_url: record.avatar_url }));
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile picture' });
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
        <div className="max-w-2xl mx-auto">
          <div className="glass-card">
            <div className="p-6 space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <ThemeToggle />
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                  }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {profile.avatar_url ? (
                      <img
                        src={pb.getFileUrl(profile, profile.avatar_url)}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-24 h-24 text-muted-foreground" />
                    )}
                    <label className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-white cursor-pointer">
                      <CameraIcon className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click the camera icon to update your profile picture
                  </p>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <div>
                      <label className="block text-sm font-medium mb-1">Kodku</label>
                      <input
                        disabled
                        type="text"
                        className="input-field"
                        value={profile.kodku}
                        onChange={e => setProfile({ ...profile, kodku: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">username</label>
                      <input
                        disabled
                        type="text"
                        className="input-field"
                        value={profile.username}
                        onChange={e => setProfile({ ...profile, username: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        disabled
                        type="text"
                        className="input-field"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={profile.full_name}
                        onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        className="input-field"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      className="input-field min-h-[100px]"
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Bank Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Bank Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={profile?.bank_details?.bank_name}
                        onChange={e => setProfile({
                          ...profile,
                          bank_details: { ...profile?.bank_details, bank_name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Account Number</label>
                      <input
                        type="text"
                        className="input-field"
                        value={profile.bank_details?.account_number}
                        onChange={e => setProfile({
                          ...profile,
                          bank_details: { ...profile.bank_details, account_number: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Account Holder</label>
                      <input
                        type="text"
                        className="input-field"
                        value={profile.bank_details?.account_holder}
                        onChange={e => setProfile({
                          ...profile,
                          bank_details: { ...profile.bank_details, account_holder: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Referal Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Referal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Referal Name</label>
                      <input
                        disabled
                        type="text"
                        className="input-field"
                        value={profile.referal_name}
                        onChange={e => setProfile({
                          ...profile,
                          referal_code: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => window.location.reload()}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
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