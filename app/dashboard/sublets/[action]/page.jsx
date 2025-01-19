"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { subletAPI } from '../../../../services/api';

const initialFormData = {
  name: "",
  address: "",
  total_room: 0,
  rental_price_per_month: 0,
  deposit_amount: 0,
  status: "available",
  description: "",
  amenities: [],
  rules: [],
  images: [],
  location: {
    lat: 0,
    lng: 0,
  },
  total_occupied_rooms: 0,
};

export default function SubletFormPage({ params }) {
  const router = useRouter();
  const isEditing = params.action && params.action !== "new";

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isSubscribed = true;

    const loadSublet = async () => {
      try {

        const record = await subletAPI.getOne(params.id);
        if (isSubscribed) {
          setFormData({
            ...record,
            images: [], // Reset images since we can't load them directly
          });
        }
      } catch (error) {
        if (isSubscribed) {
          console.error("Error loading sublet:", error);
          setError("Failed to load sublet");
        }
      }
    };

    if (isEditing) {
      loadSublet();
    }

    return () => {
      isSubscribed = false;
    };
  }, [isEditing, params.action]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEditing) {
        await subletAPI.update(params.action, formData);
      } else {
        await subletAPI.create(formData);
      }
      router.push("/dashboard/sublets");
    } catch (error) {
      console.error("Error saving sublet:", error);
      setError(error?.message || "Failed to save sublet");
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
              href="/dashboard/sublets"
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Sublets
            </Link>
          </div>

          <div className="glass-card">
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-6">
                {isEditing ? "Edit Sublet" : "Add New Sublet"}
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
                      Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rental price per month
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.rental_price_per_month}
                      onChange={(e) =>
                        setFormData({ ...formData, rental_price_per_month: e.target.value })
                      }
                      required
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Deposit Amount
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.deposit_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, deposit_amount: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Status
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
                    >
                      <option value="available">Available</option>
                      <option value="half occupied">Half Occupied</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    className="input-field min-h-[100px]"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  // required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total Rooms
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.total_room}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_room: parseInt(e.target.value),
                        })
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Total Occupied Rooms
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.total_occupied_rooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_occupied_rooms: parseInt(e.target.value),
                        })
                      }
                      required
                      min="0"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn-primary w-auto py-2 px-4 rounded text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isEditing ? "Save Changes" : "Create Sublet"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
