'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { pb } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle');

  // Debounce function to prevent too many API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Check username availability
  const checkUsername = async (username) => {
    if (!username || username.length < 3) return;
    
    setUsernameStatus('checking');
    try {
      const result = await pb.collection('usersku').getList(1, 1, {
        filter: `username = "${username}"`
      });
      
      setUsernameStatus(result.totalItems === 0 ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameStatus('idle');
    }
  };

  // Debounced version of checkUsername
  const debouncedCheckUsername = debounce(checkUsername, 500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.passwordConfirm) {
        throw new Error('Passwords do not match');
      }

      // Check username availability one final time before submission
      const usernameCheck = await pb.collection('usersku').getList(1, 1, {
        filter: `username = "${formData.username}"`
      });

      if (usernameCheck.totalItems > 0) {
        throw new Error('Username is already taken');
      }

      // Create user account with all fields
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        emailVisibility: true,
        // Optional fields with empty/null values
        kodku: "",
        no_ic: "",
        ic_img_url: "",
        phone: "",
        bio: "",
        avatar_url: "",
        bank_details: JSON.stringify({
          bank_name: "",
          account_number: "",
          account_holder: ""
        }),
        referal_code: ""
      };

      // Create user with all fields
      const user = await pb.collection('usersku').create(userData);

      // Assign default tenant role - assign user as guess
      await pb.collection('tenant_roles').create({
        user: user.id,
        role: '2h1xh7gfv2pmt42', // ID of tenant role in roles collection
        tenant: 'rb0s8fazmuf44ac', // ID of tenant role in roles collection
        created_at: new Date(),
      });

      // Send verification email
      await pb.collection('usersku').requestVerification(formData.email, {
        emailTemplate: {
          actionUrl: 'http://localhost:3000/verification/{token}'
        }
      });
      
      // Show verification message
      setVerificationSent(true);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error?.data?.message || error?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8 p-6 bg-background border rounded-lg shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Check Your Email
            </h2>
            <div className="mt-4 text-muted-foreground">
              <p>We've sent a verification email to:</p>
              <p className="font-medium text-foreground mt-2">{formData.email}</p>
              <p className="mt-4">
                Please check your email and click the verification link to activate your account.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-primary text-primary-foreground hover:opacity-90 py-2 px-4 rounded-md transition-opacity"
              >
                Go to Login
              </button>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await pb.collection('usersku').requestVerification(formData.email);
                    alert('Verification email resent!');
                  } catch (error) {
                    console.error('Error resending verification:', error);
                    alert('Failed to resend verification email. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full bg-secondary text-secondary-foreground hover:opacity-90 py-2 px-4 rounded-md disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4">
      {/* Background gradient circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Login Link */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-3xl font-bold text-primary">BilikKu</span>
          </Link>
        </div>

        <div className="glass-panel space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">Sign up for a new account</p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field mt-1"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="relative mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={3}
                    className={`input-field mt-1 ${
                      usernameStatus === 'taken' ? 'border-destructive' : 
                      usernameStatus === 'available' ? 'border-green-500' : ''
                    }`}
                    value={formData.username}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, username: value });
                      if (value.length >= 3) {
                        debouncedCheckUsername(value);
                      } else {
                        setUsernameStatus('idle');
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                    {usernameStatus === 'checking' && (
                      <span className="text-muted-foreground">Checking...</span>
                    )}
                    {usernameStatus === 'taken' && (
                      <span className="text-destructive">Username taken</span>
                    )}
                    {usernameStatus === 'available' && (
                      <span className="text-green-500">Available</span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Username must be at least 3 characters long
                </p>
              </div>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 