"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface RoomFormProps {
  roomId?: string;
}

interface Sublet {
  id: string;
  name: string;
}

interface RoomData {
  number: string;
  type: string;
  floor: string;
  status: "available" | "occupied" | "maintenance";
  rent_amount: number;
  description: string;
  sublet_id: string;
  amenities: string[];
  size_sqft: number;
  max_occupants: number;
  deposit_amount: number;
}

const INITIAL_ROOM_DATA: RoomData = {
  number: "",
  type: "",
  floor: "",
  status: "available",
  rent_amount: 0,
  description: "",
  sublet_id: "",
  amenities: [],
  size_sqft: 0,
  max_occupants: 1,
  deposit_amount: 0,
};

const ROOM_TYPES = [
  "Single Room",
  "Master Room",
  "Middle Room",
  "Small Room",
  "Studio",
  "Entire Unit",
];

const COMMON_AMENITIES = [
  "Air Conditioning",
  "Attached Bathroom",
  "Wardrobe",
  "Window",
  "Fan",
  "Study Table",
  "Chair",
  "Bed Frame",
  "Mattress",
  "WiFi",
  "Water Heater",
];

export default function RoomForm({ roomId }: RoomFormProps) {
  const router = useRouter();
  const { pb } = useAuth();
  const [formData, setFormData] = useState<RoomData>(INITIAL_ROOM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sublets, setSublets] = useState<Sublet[]>([]);
  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    loadSublets();
    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  const loadSublets = async () => {
    try {
      const records = await pb.collection("bilikku_sublets").getList(1, 50, {
        sort: "name",
        fields: "id,name",
      });
      setSublets(records.items as Sublet[]);
    } catch (err: any) {
      console.error("Error loading sublets:", err);
      setError("Failed to load sublets");
    }
  };

  const loadRoom = async () => {
    try {
      pb.autoCancellation(false);

      const record = await pb.collection("bilikku_rooms").getOne(roomId!);
      setFormData(record as RoomData);

      pb.autoCancellation(true);
      
    } catch (err: any) {
      console.error("Error loading room:", err);
      setError(err.message || "Failed to load room");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (roomId) {
        await pb.collection("bilikku_rooms").update(roomId, formData);
      } else {
        await pb.collection("bilikku_rooms").create(formData);
      }
      router.push("/dashboard/rooms");
      router.refresh();
    } catch (err: any) {
      console.error("Error saving room:", err);
      setError(err.message || "Failed to save room");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "rent_amount",
        "size_sqft",
        "max_occupants",
        "deposit_amount",
      ].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
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
              <h1 className="text-2xl font-bold mb-6">
                {roomId ? "Edit Room" : "Add New Room"}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="sublet_id"
                      className="block text-sm font-medium"
                    >
                      Sublet *
                    </label>
                    <select
                      id="sublet_id"
                      name="sublet_id"
                      value={formData.sublet_id}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select a sublet</option>
                      {sublets.map((sublet) => (
                        <option key={sublet.id} value={sublet.id}>
                          {sublet.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium"
                    >
                      Room Number *
                    </label>
                    <input
                      type="text"
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="e.g., A101"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="type" className="block text-sm font-medium">
                      Room Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select room type</option>
                      {ROOM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="floor"
                      className="block text-sm font-medium"
                    >
                      Floor *
                    </label>
                    <input
                      type="text"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="e.g., Ground Floor, First Floor"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="size_sqft"
                      className="block text-sm font-medium"
                    >
                      Size (sq ft)
                    </label>
                    <input
                      type="number"
                      id="size_sqft"
                      name="size_sqft"
                      value={formData.size_sqft}
                      onChange={handleChange}
                      min="0"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="max_occupants"
                      className="block text-sm font-medium"
                    >
                      Max Occupants
                    </label>
                    <input
                      type="number"
                      id="max_occupants"
                      name="max_occupants"
                      value={formData.max_occupants}
                      onChange={handleChange}
                      min="1"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="rent_amount"
                      className="block text-sm font-medium"
                    >
                      Rent Amount (RM) *
                    </label>
                    <input
                      type="number"
                      id="rent_amount"
                      name="rent_amount"
                      value={formData.rent_amount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="deposit_amount"
                      className="block text-sm font-medium"
                    >
                      Deposit Amount (RM)
                    </label>
                    <input
                      type="number"
                      id="deposit_amount"
                      name="deposit_amount"
                      value={formData.deposit_amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMON_AMENITIES.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
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
                      {formData.amenities.map((amenity) => (
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

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    placeholder="Enter room description..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading
                      ? "Saving..."
                      : roomId
                      ? "Update Room"
                      : "Create Room"}
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
