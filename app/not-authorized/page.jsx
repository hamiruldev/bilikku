'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function NotAuthorizedPage() {

    if (typeof window !== 'undefined' && localStorage.getItem('isAdmin') == null) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>;
    }

    const { user } = useAuth();
    const router = useRouter();

    const handleRedirect = () => {
        if (user?.role === 'guest') {
            router.push('/bilikku');
        } else if (user?.role === 'admin') {
            router.push('/dashboard');
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full px-4">
                <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-destructive" />
                    <h1 className="mt-4 text-3xl font-bold text-foreground">
                        Not Authorized
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        You don't have permission to access this page.
                    </p>
                    <button
                        onClick={handleRedirect}
                        className="mt-6 btn-primary inline-flex items-center"
                    >
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Go to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
} 