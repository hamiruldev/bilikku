'use client';

import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { locale, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(locale === 'en' ? 'ms' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="btn-secondary inline-flex items-center gap-2 px-4"
      title={locale === 'en' ? 'Switch to Bahasa Melayu' : 'Switch to English'}
    >
      {locale === 'en' ? (
        <span className="text-lg">🇲🇾</span>
      ) : (
        <span className="text-lg">🇬🇧</span>
      )}
    </button>
  );
} 