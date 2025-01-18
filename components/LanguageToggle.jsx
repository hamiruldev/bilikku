'use client';

import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary"
        >
            {language === 'en' ? 'ms' : 'en'}
        </button>
    );
} 