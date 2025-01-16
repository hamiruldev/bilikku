"use client";

import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

export default function SubletListPage() {
  const { pb, user } = useAuth();
  const router = useRouter();
  const [sublets, setSublets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSublets = async () => {
    try {
      const records = await pb.collection("bilikku_sublets").getList(1, 50, {
        sort: "-created",
      });
      setSublets(records.items);
    } catch (error) {
      console.error("Error loading sublets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSublets();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this sublet?")) return;

    try {
      await pb.collection("bilikku_sublets").delete(id);
      await loadSublets();
    } catch (error) {
      console.error("Error deleting sublet:", error);
      alert("Failed to delete sublet. Please try again.");
    }
  };

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
          <h1 className="text-3xl font-bold">Sublets</h1>
          <Link
            href="/dashboard/sublets/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Sublet
          </Link>
        </div>

        <div className="grid gap-6">
          {sublets.map((sublet) => (
            <div key={sublet.id} className="glass-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{sublet.name}</h3>
                  <p className="text-muted-foreground mt-1">{sublet.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/sublets/edit/${sublet.id}`}
                    className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(sublet.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status Rooms</p>
                  <p className="font-medium">
                    {sublet.total_occupied_rooms || 0} / {sublet.total_room} left
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Rental
                  </p>
                  <p className="font-medium">
                    RM {sublet.rental_price_per_month?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${sublet.status === "available"
                        ? "bg-green-100 text-green-800"
                        : sublet.status === "half occupied"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {sublet.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {sublets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sublets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
