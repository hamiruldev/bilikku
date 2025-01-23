'use client';

import { useLanguage } from '../context/LanguageContext';

export function LoadingTable() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
} 