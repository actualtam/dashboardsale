'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n';

interface Branch {
  id: string;
  name: string;
  code: string;
  isMain: boolean;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  currentBranchId: string;
  setCurrentBranchId: (id: string) => void;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  shiftStatus: 'OPEN' | 'CLOSED';
  setShiftStatus: (status: 'OPEN' | 'CLOSED') => void;
  activeShift: any;
  setActiveShift: (shift: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ru');
  const [currentBranchId, setCurrentBranchIdState] = useState<string>('all');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [shiftStatus, setShiftStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [activeShift, setActiveShift] = useState<any>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('billz_lang') as Language;
    if (savedLang && (savedLang === 'uz' || savedLang === 'ru' || savedLang === 'en')) {
      setLangState(savedLang);
    }
    const savedBranch = localStorage.getItem('billz_branch');
    if (savedBranch) {
      setCurrentBranchIdState(savedBranch);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('billz_lang', newLang);
  };

  const setCurrentBranchId = (id: string) => {
    setCurrentBranchIdState(id);
    localStorage.setItem('billz_branch', id);
  };

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[lang] || translations.ru;
    return (dict as any)[key] || translations.en[key] || String(key);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentBranchId,
        setCurrentBranchId,
        branches,
        setBranches,
        shiftStatus,
        setShiftStatus,
        activeShift,
        setActiveShift,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
