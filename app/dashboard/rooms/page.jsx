"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { roomAPI, subletAPI } from '../../../services/api';

export default function RoomsPage() {
  const { user, pb } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    sublet_id: "",
  });
  const [rooms, setRooms] = useState([]);
  const [sublets, setSublets] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  let hasLoaded = false;

  useEffect(() => {
    loadRooms();
    loadSublets();
  }, []);

  const loadRooms = () => {

    if (hasLoaded) return;
    hasLoaded = true;

    roomAPI
      .getList()
      .then((records) => {
        setLoading(false);

        setRooms(records.items);

        // Extract unique room types
        const types = [...new Set(records.items.map((room) => room.type))];
        setRoomTypes(types);

        setError(null);

      })
      .catch((err) => {
        console.error("Error loading rooms:", err);
        setError(err.message || "Failed to load rooms");
        setLoading(false);
      })

  };

  const loadSublets = async () => {
    try {
      const records = await subletAPI.getList(1, 50, {
        sort: "name",
        fields: "id,name",
      });
      setSublets(records.items);
    } catch (err) {
      console.error("Error loading sublets:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      await roomAPI.delete(id);
      await loadRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
      alert(err.message || "Failed to delete room");
    }
  };

  // Filter rooms based on search term and filters
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room?.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.expand?.sublet_id?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filters.status || room.status === filters.status;
    const matchesType =
      !filters.type || room.type === filters.type;
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

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rooms</h1>
          <Link
            href="/dashboard/rooms/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Room
          </Link>
        </div>

        <div className="glass-card mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  className="input-field"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>

                <select
                  className="input-field"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <option value="">All Types</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  className="input-field"
                  value={filters.sublet_id}
                  onChange={(e) =>
                    setFilters({ ...filters, sublet_id: e.target.value })
                  }
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

        {/* Rooms Grid */}
        <div className="grid gap-6">



          {!loading && filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms found</p>
            </div>
          )}

          {!loading && filteredRooms.length != 0 && filteredRooms.map((room) => (
            <div key={room.id} className="glass-card">
              <div className="flex justify-between items-start p-6">
                <div>
                  <h3 className="text-xl font-semibold">Room {room.number}</h3>
                  <p className="text-muted-foreground mt-1">
                    {room.expand?.sublet_id?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/rooms/edit/${room.id}`}
                    className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-glass-border px-6 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
              ${room.status === "available"
                          ? "bg-green-100 text-green-800"
                          : room.status === "occupied"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {room.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{room.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Monthly Rental
                    </p>
                    <p className="font-medium">
                      RM {room.price_per_month?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div >
  );
}
