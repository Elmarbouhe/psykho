'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from '@/locales/en';
import { fr } from '@/locales/fr';
import { ar } from '@/locales/ar';

export type Language = 'en' | 'fr' | 'ar';
export type TranslationKeys = keyof typeof en;

const translations = {
    en,
    fr,
    ar,
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLanguage = 'en' }: { children: React.ReactNode; initialLanguage?: string }) {
    const [language, setLanguageState] = useState<Language>(initialLanguage as Language);
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

    useEffect(() => {
        // 1. Update Direction
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        setDirection(dir);
        document.documentElement.dir = dir;
        document.documentElement.lang = language;

        // 2. Persist to localStorage (optional backup)
        localStorage.setItem('psykho-lang', language);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    /**
     * Recursive translation helper
     * Usage: t('common.save')
     */
    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                // Fallback to English if missing
                console.warn(`Missing translation for key: ${path} in language: ${language}`);
                return path;
            }
        }
        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir: direction }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
