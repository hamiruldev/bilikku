'use client';

import Link from 'next/link';
import { useState } from 'react';
import { userAPI } from '../../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await userAPI.requestPasswordReset(email);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error?.data?.message || error?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8 p-6 bg-background border rounded-lg shadow-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Check Your Email
            </h2>
            <div className="mt-4 text-muted-foreground">
              <p>We've sent a password reset link to:</p>
              <p className="font-medium text-foreground mt-2">{email}</p>
              <p className="mt-4">
                Please check your email and click the link to reset your password.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <Link
                href="/login"
                className="block w-full bg-primary text-primary-foreground hover:opacity-90 py-2 px-4 rounded-md text-center transition-opacity"
              >
                Return to Login
              </Link>
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await userAPI.requestPasswordReset(email);
                    alert('Reset email resent!');
                  } catch (error) {
                    console.error('Error resending reset email:', error);
                    alert('Failed to resend reset email. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full bg-secondary text-secondary-foreground hover:opacity-90 py-2 px-4 rounded-md disabled:opacity-50 transition-opacity"
              >
                {loading ? 'Sending...' : 'Resend Reset Email'}
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

      <div className="glass-card w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-3xl font-bold text-primary">BilikKu</span>
          </Link>
        </div>

        <div className="glass-panel space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 