'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface DecodedToken {
  email: string;
  exp: number;
  id: string;
}

export default function VerificationPage() {
  const params = useParams();
  const { pb } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = params.token as string;

      if (!token) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        // Decode JWT to get email (just for display purposes)
        const [, payloadBase64] = token.split('.');
        const decodedPayload = JSON.parse(atob(payloadBase64)) as DecodedToken;
        setUserEmail(decodedPayload.email);

        // Verify the email
        await pb.collection('usersku').confirmVerification(token);
        setStatus('success');
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setError(error?.data?.message || error?.message || 'Failed to verify email');
      }
    };

    verifyToken();
  }, [params.token, pb]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      {/* Background gradient circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full">
        <div className="glass-panel text-center space-y-6">
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
              <h1 className="text-4xl font-bold tracking-tight">
                Verifying Email
              </h1>
              <p className="text-lg text-muted-foreground">
                Just a moment while we verify your email address...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  Verified!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your email address has been verified successfully
                </p>
              </div>
              <div className="pt-6 space-y-4">
                <Link
                  href={`/login?email=${encodeURIComponent(userEmail)}&verified=true`}
                  className="btn-primary block w-full"
                >
                  Continue to Login
                </Link>
                <p className="text-sm text-muted-foreground">
                  You can now sign in using your email and password
                </p>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-6">
              <XCircleIcon className="w-20 h-20 text-destructive mx-auto" />
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  Verification Failed
                </h1>
                <p className="text-lg text-destructive">
                  {error}
                </p>
              </div>
              <div className="pt-6 space-y-4">
                <Link
                  href="/login"
                  className="btn-primary block w-full"
                >
                  Return to Login
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary block w-full"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 