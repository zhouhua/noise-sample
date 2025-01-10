'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { LocaleCode, setLocale } from './index';

interface LanguageContextType {
  language: LocaleCode;
  setLanguage: (lang: LocaleCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LocaleCode>('zh-CN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as LocaleCode;
    if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
      setLanguageState(savedLang);
      setLocale(savedLang);
    } else {
      const browserLang = navigator.language;
      const newLang = browserLang.startsWith('zh') ? 'zh-CN' : 'en-US';
      setLanguageState(newLang);
      setLocale(newLang);
      localStorage.setItem('language', newLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: LocaleCode) => {
    setLanguageState(lang);
    setLocale(lang);
    localStorage.setItem('language', lang);
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 