import PocketBase from 'pocketbase';

let pb: PocketBase;

// Initialize PocketBase on the client side only
if (typeof window !== 'undefined') {
  pb = new PocketBase('https://hamirulhafizal.pockethost.io');
  
  // Load the stored auth data from cookies
  pb.authStore.loadFromCookie(document?.cookie ?? '');
  
  // Listen to auth state changes and update cookie
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  });
} else {
  // Server-side initialization
  pb = new PocketBase('https://hamirulhafizal.pockethost.io');
}

export { pb }; 