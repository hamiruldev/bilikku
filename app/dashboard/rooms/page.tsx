"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Room {
  id: string;
  number: string;
  status: "available" | "occupied" | "maintenance";
  type: string;
  floor: string;
  rent_amount: number;
  description?: string;
  sublet_id: string;
  amenities: string[];
  size_sqft: number;
  max_occupants: number;
  deposit_amount: number;
  created: string;
  updated: string;
  expand?: {
    sublet_id: {
      name: string;
    };
  };
}

interface FilterState {
  status: string;
  type: string;
  sublet_id: string;
}

export default function RoomsPage() {
  const { user, pb } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    type: "",
    sublet_id: "",
  });
  const [sublets, setSublets] = useState<{ id: string; name: string }[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  useEffect(() => {
    loadRooms();
    loadSublets();
  }, []);

  const loadSublets = async () => {
    try {
      const records = await pb.collection("bilikku_sublets").getList(1, 50, {
        sort: "name",
        fields: "id,name",
      });
      setSublets(records.items as { id: string; name: string }[]);
    } catch (err) {
      console.error("Error loading sublets:", err);
    }
  };

  const loadRooms = async () => {
    try {
      pb.autoCancellation(false);

      const records = await pb.collection("bilikku_rooms").getList(1, 50, {
        sort: "-created",
      });

      console.log("records", records);

      setRooms(records.items as Room[]);

      // Extract unique room types
      const types = [...new Set(records.items.map((room: Room) => room.type))];
      setRoomTypes(types);

      setError(null);
      pb.autoCancellation(true);
    } catch (err: any) {
      console.error("Error loading rooms:", err);
      setError(err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await pb.collection("bilikku_rooms").delete(id);
      await loadRooms();
    } catch (err: any) {
      console.error("Error deleting room:", err);
      alert(err.message || "Failed to delete room");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.expand?.sublet_id?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || room.status === filters.status;
    const matchesType = !filters.type || room.type === filters.type;
    const matchesSublet =
      !filters.sublet_id || room.sublet_id === filters.sublet_id;

    return matchesSearch && matchesStatus && matchesType && matchesSublet;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">Error: {error}</div>
          <button
            onClick={loadRooms}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"
          >
            Retry
          </button>
        </div>
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
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <Link
            href="/dashboard/rooms/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Room
          </Link>
        </div>

        <div className="glass-card mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.sublet_id}
                  onChange={(e) =>
                    setFilters({ ...filters, sublet_id: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">All Sublets</option>
                  {sublets.map((sublet) => (
                    <option key={sublet.id} value={sublet.id}>
                      {sublet.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">Room Details</th>
                  <th className="px-4 py-3 text-left">Sublet</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Rent</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{room.number}</div>
                        <div className="text-sm text-muted-foreground">
                          {room.type} • {room.floor}
                        </div>
                        {room.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.amenities
                              .slice(0, 3)
                              .map((amenity, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 bg-primary/10 rounded-full text-xs"
                                >
                                  {amenity}
                                </span>
                              ))}
                            {room.amenities.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-primary/10 rounded-full text-xs">
                                +{room.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {room.expand?.sublet_id?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          room.status === "available"
                            ? "bg-green-100 text-green-800"
                            : room.status === "occupied"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {room.status.charAt(0).toUpperCase() +
                          room.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium">
                        RM {room.rent_amount?.toFixed(2)}
                      </div>
                      {room.deposit_amount > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Deposit: RM {room.deposit_amount.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/rooms/${room.id}`}
                          className="p-2 hover:bg-muted rounded-md"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="p-2 hover:bg-muted rounded-md text-destructive"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No rooms found matching your criteria
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
