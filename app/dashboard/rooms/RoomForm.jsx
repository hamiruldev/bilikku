"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { roomAPI } from '../../../services/api';

const ROOM_TYPES = [
  'Single Room',
  'Master Room',
  'Middle Room',
  'Small Room',
  'Studio',
  'Entire Unit'
];

const COMMON_AMENITIES = [
  'Air Conditioning',
  'Attached Bathroom',
  'Wardrobe',
  'Window',
  'Fan',
  'Study Table',
  'Chair',
  'Bed Frame',
  'Mattress',
  'WiFi',
  'Water Heater'
];

const initialFormData = {
  number: '',
  type: '',
  floor: '',
  status: 'available',
  price_per_month: 0,
  deposit_amount: 0,
  description: '',
  sublet_id: '',
  amenities: [],
  size_sqft: 0,
  max_occupants: 1,
};

export default function RoomForm({ action }) {
  const { pb } = useAuth();
  const router = useRouter();
  const isEditing = action && action !== 'new';

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sublets, setSublets] = useState([]);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    loadSublets();
    if (isEditing) {
      loadRoom();
    }
  }, [isEditing, action]);
  const loadSublets = async () => {
    try {
      const records = await roomAPI.getList();
      setSublets(records.items);
    } catch (err) {
      console.error('Error loading sublets:', err);
      setError('Failed to load sublets');
    }
  };

  const loadRoom = async () => {
    try {
      const record = await roomAPI.getRoom(action);
      setFormData({
        ...record,
        amenities: JSON.parse(record.amenities) || [],
      });
    } catch (err) {
      console.error('Error loading room:', err);
      setError(err.message || 'Failed to load room');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        amenities: JSON.stringify(formData.amenities)
      };

      if (isEditing) {
        await roomAPI.updateRoom(action, dataToSend);
      } else {
        await roomAPI.createRoom(dataToSend);
      }
      router.push('/dashboard/rooms');
    } catch (err) {
      console.error('Error saving room:', err);
      setError(err.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  console.log("formData-->", formData);

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
              href="/dashboard/rooms"
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Rooms
            </Link>
          </div>

          <div className="glass-card">
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">
                {isEditing ? 'Edit Room' : 'Add New Room'}
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
                      Sublet *
                    </label>
                    <select
                      className="input-field"
                      value={formData.sublet_id}
                      onChange={(e) =>
                        setFormData({ ...formData, sublet_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a sublet</option>
                      {sublets.map(sublet => (
                        <option key={sublet.id} value={sublet.id}>
                          {sublet.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      required
                      placeholder="e.g., A101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Room Type *
                    </label>
                    <select
                      className="input-field"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      required
                    >
                      <option value="">Select room type</option>
                      {ROOM_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Floor *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.floor}
                      onChange={(e) =>
                        setFormData({ ...formData, floor: e.target.value })
                      }
                      required
                      placeholder="e.g., Ground Floor, First Floor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status *
                    </label>
                    <select
                      className="input-field"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value
                        })
                      }
                      required
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Size (sq ft)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.size_sqft}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          size_sqft: parseInt(e.target.value)
                        })
                      }
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Max Occupants
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.max_occupants}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_occupants: parseInt(e.target.value)
                        })
                      }
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rent Amount (RM) *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.price_per_month}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price_per_month: parseFloat(e.target.value)
                        })
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Deposit Amount (RM)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.deposit_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deposit_amount: parseFloat(e.target.value)
                        })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMON_AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      className="input-field flex-1"
                      placeholder="Add custom amenity"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.amenities.map(amenity => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-primary/10 rounded-full text-sm flex items-center"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className="ml-2 text-xs hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field min-h-[150px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter room description..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/dashboard/rooms" className="btn-secondary">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update Room' : 'Create Room'}
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
