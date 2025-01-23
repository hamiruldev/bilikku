import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authAPI,
  roomAPI,
  tenantAPI,
  subletAPI,
  dashboardAPI,
  userAPI,
  LOV,
} from "../services/api";

// Auth Queries
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: authAPI.getCurrentUser,
    staleTime: Infinity, // User data doesn't go stale
  });
}

export function useUserUsername(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userAPI.getUsername(id),
    enabled: !!id,
    onError: (error) => {
      console.error("Error fetching username:", error);
    },
    onSettled: () => {
      // Any additional logic after the query settles can be added here
    },
  });
}

// Room Queries
export function useRooms(options = {}) {
  return useQuery({
    queryKey: ["rooms", options],
    queryFn: async () => {
      const response = await roomAPI.getList(1, 50, options);

      console.log("response", response);

      if (response.items) {
        window.LOV = {
          ...window.LOV,
          rooms: response.items,
        };
      }

      return {
        items: response.items || [],
        total: response.total || 0,
      };
    },
  });
}

export function useRoom(id) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => roomAPI.getOne(id),
    enabled: !!id,
  });
}

// Tenant Queries
export function useTenants(options = {}) {
  const response = useQuery({
    queryKey: ["tenants", options],
    queryFn: () => tenantAPI.getList(1, 50, options),
  });

  if (response.data) {
    window.LOV = {
      ...window.LOV,
      tenants: response.data.items,
    };
  }
  return response;
}

export function useTenant(id) {
  return useQuery({
    queryKey: ["tenant", id],
    queryFn: () => tenantAPI.getOne(id),
    enabled: !!id,
  });
}

// Add this new query for tenants with details
export function useTenantsWithDetails() {
  return useQuery({
    queryKey: ["tenantsWithDetails"],
    queryFn: tenantAPI.getListWithDetails,
  });
}

// Sublet Queries
export function useSublets(options = {}) {
  const response = useQuery({
    queryKey: ["sublets", options],
    queryFn: () => subletAPI.getList(1, 50, options),
  });

  if (response.data) {
    window.LOV = {
      ...window.LOV,
      sublets: response.data.items,
    };
  }

  return response;
}

export function useSublet(id) {
  return useQuery({
    queryKey: ["sublet", id],
    queryFn: () => subletAPI.getOne(id),
    enabled: !!id,
  });
}

// Dashboard Queries
export function useAdminStats() {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: dashboardAPI.getAdminStats,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

export function useTenantStats(userId) {
  return useQuery({
    queryKey: ["tenantStats", userId],
    queryFn: () => dashboardAPI.getTenantStats(userId),
    enabled: !!userId,
  });
}

// Add this new query for admin dashboard stats
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: dashboardAPI.getAdminStats,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
  });
}

// Mutations
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => roomAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["rooms"]);
      queryClient.invalidateQueries(["room", variables.id]);
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
    },
  });
}

// Similar mutations for tenants and sublets...

// Add these new mutations for tenants
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tenantAPI.createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries(["tenants"]);
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tenantAPI.updateTenant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["tenants"]);
      queryClient.invalidateQueries(["tenant", variables.id]);
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tenantAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["tenants"]);
    },
  });
}

// Add these new mutations for sublets
export function useCreateSublet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subletAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["sublets"]);
    },
  });
}

export function useUpdateSublet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => subletAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["sublets"]);
      queryClient.invalidateQueries(["sublet", variables.id]);
    },
  });
}

export function useDeleteSublet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subletAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["sublets"]);
    },
  });
}

// Add these new queries for additional data
export function useRoomTypes() {
  return useQuery({
    queryKey: ["roomTypes"],
    queryFn: async () => {
      const rooms = await roomAPI.getList();
      return [...new Set(rooms.items.map((room) => room.type))];
    },
  });
}

export function useSubletOptions() {
  return useQuery({
    queryKey: ["subletOptions"],
    queryFn: async () => {
      const records = await subletAPI.getList(1, 50, {
        sort: "name",
        fields: "id,name",
      });
      return records.items.map(({ id, ...rest }) => ({
        sublet_id: id,
        ...rest,
      }));
    },
  });
}

export function useLOVUser() {
  const users = useQuery({
    queryKey: ["userku"],
    queryFn: LOV.getUsers,
  });

  window.LOV = { users: users.data };

  return users;
}
