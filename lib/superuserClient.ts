import PocketBase from 'pocketbase';

// Create a superuser client instance
const superuserClient = new PocketBase('https://hamirulhafizal.pockethost.io');

// Disable autocancellation for handling async requests from multiple users
superuserClient.autoCancellation(false);

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