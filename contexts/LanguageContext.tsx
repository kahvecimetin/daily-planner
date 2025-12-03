import React, { createContext, useContext, useState, useCallback } from 'react';
import i18n from '@/i18n';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(i18n.locale as Language);

  const setLanguage = useCallback((lang: Language) => {
    i18n.locale = lang;
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string, options?: Record<string, unknown>) => {
    return i18n.t(key, options);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper hooks for common translations
export function useTranslation() {
  const { t, language } = useLanguage();

  const months = i18n.t('months') as string[];
  const daysShort = i18n.t('days.short') as string[];
  const daysFull = i18n.t('days.full') as string[];

  return {
    t,
    language,
    months,
    daysShort,
    daysFull,
  };
}
