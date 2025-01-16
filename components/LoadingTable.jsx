'use client';

import { useLanguage } from '../context/LanguageContext';

export function LoadingTable() {
  const { t } = useLanguage();
  
  return (
    <tr>
      <td colSpan="6" className="text-center py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </td>
    </tr>
  );
} 