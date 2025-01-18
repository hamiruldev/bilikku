// Import PocketBase instance
import { pb } from "../lib/pocketbase";
import { superuserClient } from "../lib/superuserClient";

// User related API calls
export const userAPI = {
  // Authentication
  login: async (email, password) => {
    return await pb.collection("usersku").authWithPassword(email, password);
  },

  register: async (userData) => {
    return await pb.collection("usersku").create(userData);
  },

  validateUsername: async (username) => {
    try {
      const result = await pb.collection("usersku").getList(1, 1, {
        filter: `username = "${username}"`,
      });
      return result.items.length === 0;
    } catch (error) {
      throw error;
    }
  },

  validateEmail: async (email) => {
    try {
      const result = await pb.collection("usersku").getList(1, 1, {
        filter: `email = "${email}"`,
      });
      return result.items.length === 0;
    } catch (error) {
      throw error;
    }
  },

  requestPasswordReset: async (email) => {
    return await pb.collection("usersku").requestPasswordReset(email);
  },

  // Profile management
  getProfile: async (userId) => {
    return await pb.collection("usersku").getOne(userId);
  },

  updateProfile: async (userId, formData) => {
    return await pb.collection("usersku").update(userId, formData);
  },

  getAllUsers: async (page = 1, perPage = 50, options = {}) => {
    return await pb.collection("usersku").getList(page, perPage, {
      sort: "username",
      ...options,
    });
  },

  validateReferralCode: async (code) => {
    try {
      const record = await pb
        .collection("usersku")
        .getFirstListItem(`kodku="${code}"`);

      console.log("record--->", record);

      return !!record; // Returns true if the record exists
    } catch (error) {
      if (error.status === 404) {
        return false; // Referral code doesn't exist
      }
      throw error;
    }
  },

  getUserDetailsBykodku: async (code) => {
    try {
      const record = await pb
        .collection("usersku")
        .getFirstListItem(`kodku="${code}"`);
      return record;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  },

  getUserDetails: async (pb, userId) => {
    try {
      if (!userId) return null;

      const record = await pb.collection("usersku").getOne(userId, {
        fields: "id,username,name,email,avatar_url",
      });

      return record;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  },

  getUsername: async (pb, userId) => {
    try {
      if (!userId) return null;

      const record = await pb.collection("usersku").getOne(userId);

      // Return name if available, otherwise username
      return record.name || record.username || null;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  },
};

// Room related API calls
export const roomAPI = {
  getList: async (page = 1, perPage = 50, options = {}) => {
    return await pb.collection("bilikku_rooms").getList(page, perPage, {
      sort: "-created",
      ...options,
    });
  },

  getOne: async (id) => {
    return await pb.collection("bilikku_rooms").getOne(id);
  },

  create: async (data) => {
    return await pb.collection("bilikku_rooms").create(data);
  },

  update: async (id, data) => {
    return await pb.collection("bilikku_rooms").update(id, data);
  },

  delete: async (id) => {
    return await pb.collection("bilikku_rooms").delete(id);
  },

  getAvailableRooms: async (page = 1, perPage = 50) => {
    return await pb.collection("bilikku_rooms").getList(page, perPage, {
      sort: "-created",
      filter: 'status="available"',
    });
  },
};

// Sublet related API calls
export const subletAPI = {
  getList: async (page = 1, perPage = 50, options = {}) => {
    return await pb.collection("bilikku_sublets").getList(page, perPage, {
      sort: "-created",
      ...options,
    });
  },

  getOne: async (id) => {
    return await pb.collection("bilikku_sublets").getOne(id);
  },

  create: async (formData) => {
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "location" || key === "amenities" || key === "rules") {
        dataToSend.append(key, JSON.stringify(value));
      } else if (key === "images") {
        value.forEach((file) => {
          dataToSend.append("images", file);
        });
      } else {
        dataToSend.append(key, value.toString());
      }
    });
    return await pb.collection("bilikku_sublets").create(dataToSend);
  },

  update: async (id, data) => {
    const dataToSend = {
      name: data.name,
      address: data.address,
      total_room: data.total_room,
      rental_price_per_month: data.rental_price_per_month,
      deposit_amount: data.deposit_amount,
      status: data.status,
      description: data.description,
      location: data.location,
      total_occupied_rooms: data.total_occupied_rooms,
    };
    return await pb.collection("bilikku_sublets").update(id, dataToSend);
  },

  delete: async (id) => {
    return await pb.collection("bilikku_sublets").delete(id);
  },
};

// Tenant related API calls
export const tenantAPI = {
  getList: async (page = 1, perPage = 50, options = {}) => {
    return await pb.collection("bilikku_tenants").getList(page, perPage, {
      sort: "-created",
      ...options,
    });
  },

  getOne: async (id, expand = {}) => {
    return await pb.collection("bilikku_tenants").getOne(id, expand);
  },

  create: async (data) => {
    return await pb.collection("bilikku_tenants").create(data);
  },

  update: async (id, data) => {
    return await pb.collection("bilikku_tenants").update(id, data);
  },

  delete: async (id) => {
    return await pb.collection("bilikku_tenants").delete(id);
  },

  getFirstByUserId: async (userId) => {
    return await pb
      .collection("bilikku_tenants")
      .getFirstListItem(`user_id="${userId}"`);
  },

  getOneWithExpand: async (id) => {
    return await pb.collection("bilikku_tenants").getOne(id, {
      expand: "tenant_name,room_name",
    });
  },

  createTenant: async (data) => {
    const formattedData = {
      ...data,
      lease_start: data.lease_start
        ? new Date(data.lease_start).toISOString()
        : null,
      lease_end: data.lease_end ? new Date(data.lease_end).toISOString() : null,
    };
    return await pb.collection("bilikku_tenants").create(formattedData);
  },

  updateTenant: async (id, data) => {
    const formattedData = {
      ...data,
      lease_start: data.lease_start
        ? new Date(data.lease_start).toISOString()
        : null,
      lease_end: data.lease_end ? new Date(data.lease_end).toISOString() : null,
    };
    return await pb.collection("bilikku_tenants").update(id, formattedData);
  },

  getListWithDetails: async (page = 1, perPage = 50) => {
    try {
      // Get tenants with expanded room info
      const records = await pb
        .collection("bilikku_tenants")
        .getList(page, perPage, {
          sort: "-created",
          expand: "room_name",
        });

      // Add usernames to each tenant
      const tenantsWithUsernames = await Promise.all(
        records.items.map(async (tenant) => {
          try {
            const userRecord = await pb
              .collection("usersku")
              .getOne(tenant.tenant_name);
            return {
              ...tenant,
              username: userRecord.name || userRecord.username,
            };
          } catch (error) {
            console.error("Error fetching username:", error);
            return {
              ...tenant,
              username: "Unknown",
            };
          }
        })
      );

      return tenantsWithUsernames;
    } catch (error) {
      throw error;
    }
  },
};

// Dashboard related API calls
export const dashboardAPI = {
  getAdminStats: async () => {
    const [rooms, tenants] = await Promise.all([
      pb.collection("bilikku_rooms").getList(1, 50),
      pb.collection("bilikku_tenants").getList(1, 50),
    ]);

    return {
      totalRooms: rooms.totalItems,
      occupiedRooms: rooms.items.filter((room) => room.status === "occupied")
        .length,
      availableRooms: rooms.items.filter((room) => room.status === "available")
        .length,
      totalTenants: tenants.totalItems,
      pendingPayments: 0,
      monthlyRevenue: 0,
    };
  },

  getTenantStats: async (userId) => {
    const tenant = await pb
      .collection("bilikku_tenants")
      .getFirstListItem(`user_id="${userId}"`);
    const room = await pb.collection("bilikku_rooms").getOne(tenant.room_id);
    const payments = await pb.collection("bilikku_payments").getList(1, 10, {
      filter: `tenant_id="${tenant.id}"`,
      sort: "-payment_date",
    });

    return {
      roomNumber: room.number,
      rentDueDate: tenant.rent_due_date,
      rentAmount: tenant.rent_amount,
      pendingPayments: payments.items.filter((p) => p.status === "pending")
        .length,
      lastPaymentDate: payments.items[0]?.payment_date || "No payments yet",
    };
  },
};

// Add other collection APIs as needed
export const otherCollectionAPI = {
  // Add methods for other collections
};

// Add this new API group
export const authAPI = {
  checkUserRole: async (userId) => {
    try {
      const user = await pb
        .collection("tenant_roles")
        .getFirstListItem(`user="${userId}"`);
      const roleId = user.role;
      const Role = await pb
        .collection("roles")
        .getFirstListItem(`id="${roleId}"`);

      return {
        role: Role.name,
        tenantId: "rb0s8fazmuf44ac",
      };
    } catch (error) {
      console.error("Error checking user role:", error);
      return {
        role: "guest",
        tenantId: "rb0s8fazmuf44ac",
      };
    }
  },

  login: async (email, password, isSuperAdmin = false) => {
    if (isSuperAdmin) {
      const isAuthenticated = await authenticateSuperuser(email, password);
      if (isAuthenticated && superuserClient.authStore.model) {
        const authModel = superuserClient.authStore.model;
        return {
          id: authModel.id,
          email: authModel.email,
          role: "superadmin",
          username: email.split("@")[0],
          isAdmin: true,
          isSuperAdmin: true,
          tenantId: "rb0s8fazmuf44ac",
        };
      }
      throw new Error("Invalid superadmin credentials");
    }

    const authData = await pb
      .collection("usersku")
      .authWithPassword(email, password);
    if (authData.record) {
      const { role, tenantId } = await authAPI.checkUserRole(
        authData.record.id
      );
      return {
        id: authData.record.id,
        email: authData.record.email,
        role: role,
        username: authData.record.username,
        isAdmin: role === "admin",
        isSuperAdmin: false,
        tenantId: tenantId,
      };
    }
    throw new Error("Login failed");
  },

  register: async (email, password, name, username) => {
    const data = {
      email,
      password,
      passwordConfirm: password,
      full_name: name,
      username: username,
    };

    const createdUser = await pb.collection("usersku").create(data);
    const authData = await pb
      .collection("usersku")
      .authWithPassword(email, password);
    return authData;
  },

  logout: () => {
    pb.authStore.clear();
    superuserClient.authStore.clear();
    // Clear cookies
    document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  },

  isValidSession: () => {
    return pb.authStore.isValid || superuserClient.authStore.isValid;
  },

  getCurrentUser: async () => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const authModel = pb.authStore.model;
      const { role, tenantId } = await authAPI.checkUserRole(authModel.id);
      return {
        id: authModel.id,
        email: authModel.email,
        role: role,
        username: authModel.username,
        isAdmin: role === "admin",
        isSuperAdmin: false,
        tenantId: tenantId,
      };
    }

    return null;
  },
};
