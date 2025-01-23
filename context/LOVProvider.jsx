'use client';

import { useLOVUser, useRooms, useSublets, useTenants } from '../hooks/useQueries';

export function LOVProvider({ children }) {
  // Check if user is not authenticated or is a guest
  if (!localStorage.pocketbase_auth || localStorage.userRole === 'guest') return children;

  // Check if LOV data is already loaded
  if (window.LOV?.users && window.LOV?.rooms && window.LOV?.sublets && window.LOV?.tenants) {
    return children;
  }

  // Load LOV data
  const { isLoading: userLoading } = useLOVUser();
  const { isLoading: subletsLoading } = useSublets();
  const { isLoading: roomsLoading } = useRooms();
  const { isLoading: tenantsLoading } = useTenants();

  // Wait until all hooks finish loading
  const isLoading = userLoading || subletsLoading || roomsLoading || tenantsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Once all hooks complete, continue and initialize window.LOV
  window.LOV = {
    users: window.LOV?.users || [],
    sublets: window.LOV?.sublets || [],
    rooms: window.LOV?.rooms || [],
    tenants: window.LOV?.tenants || [],
  };

  return children;
}
