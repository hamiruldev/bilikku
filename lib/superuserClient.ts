import PocketBase from 'pocketbase';

let superuserClient: PocketBase;

// Initialize PocketBase on the client side only
if (typeof window !== 'undefined') {
  superuserClient = new PocketBase('https://hamirulhafizal.pockethost.io');
  
  // Load the stored auth data from cookies
  superuserClient.authStore.loadFromCookie(document?.cookie ?? '');
  
  // Listen to auth state changes and update cookie
  superuserClient.authStore.onChange(() => {
    document.cookie = superuserClient.authStore.exportToCookie({
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  });
} else {
  // Server-side initialization
  superuserClient = new PocketBase('https://hamirulhafizal.pockethost.io');
}

// Function to authenticate as superuser
export const authenticateSuperuser = async (email: string, password: string) => {
  try {
    await superuserClient.admins.authWithPassword(email, password);
    return true;
  } catch (error) {
    console.error('Superuser authentication error:', error);
    return false;
  }
};

export { superuserClient }; 