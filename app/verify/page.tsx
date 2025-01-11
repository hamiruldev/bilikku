'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface DecodedToken {
  email: string;
  exp: number;
  id: string;
}

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pb } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const fullUrl = window.location.href;
      const token = fullUrl.split('confirm-verification/')[1];

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
  }, [pb]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6 bg-background border rounded-lg shadow-sm">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-pulse">
                <h2 className="text-3xl font-bold text-foreground">
                  Verifying Your Email
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Please wait while we verify your email...
                </p>
              </div>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-3xl font-bold text-foreground">
                Email Verified Successfully!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Your email ({userEmail}) has been verified.
              </p>
              <div className="mt-8 space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can now log in to your account.
                </p>
                <Link
                  href={`/login?email=${encodeURIComponent(userEmail)}`}
                  className="block w-full bg-primary text-primary-foreground hover:opacity-90 py-2 px-4 rounded-md transition-opacity text-center"
                >
                  Continue to Login
                </Link>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircleIcon className="mx-auto h-16 w-16 text-destructive mb-4" />
              <h2 className="text-3xl font-bold text-foreground">
                Verification Failed
              </h2>
              <p className="mt-2 text-destructive">{error}</p>
              <div className="mt-8 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please try again or contact support if the problem persists.
                </p>
                <Link
                  href="/login"
                  className="block w-full bg-primary text-primary-foreground hover:opacity-90 py-2 px-4 rounded-md transition-opacity text-center"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 