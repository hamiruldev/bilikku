import PocketBase from 'pocketbase';

// Create a single instance that can be imported across the app
const pb = new PocketBase('https://hamirulhafizal.pockethost.io');

// Load auth store from local storage
pb.authStore.loadFromCookie(document?.cookie ?? '');

// Update cookie on auth state change
pb.authStore.onChange(() => {
  document.cookie = pb.authStore.exportToCookie();
});

export { pb }; 