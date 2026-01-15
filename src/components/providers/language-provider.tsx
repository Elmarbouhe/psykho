'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { en } from '@/locales/en';
import { fr } from '@/locales/fr';
import { ar } from '@/locales/ar';

import { useAuth } from '@/components/providers/auth-provider';
import { ClientProfileService } from '@/services/client-profile-service';

export type Language = 'en' | 'fr' | 'ar';
export type TranslationKeys = keyof typeof en;

const translations = {
    en,
    fr,
    ar,
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLanguage = 'en' }: { children: React.ReactNode; initialLanguage?: string }) {
    const { user } = useAuth();
    const [language, setLanguageState] = useState<Language>(initialLanguage as Language);
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
    const [isLoading, setIsLoading] = useState(false);
    const hasSyncedRef = useRef(false);

    // Initial load from localStorage (if any)
    useEffect(() => {
        const storedLang = localStorage.getItem('psykho-lang');
        if (storedLang && ['en', 'fr', 'ar'].includes(storedLang)) {
            setLanguageState(storedLang as Language);
        }
    }, []);

    // Sync with User Database Profile
    useEffect(() => {
        const syncLanguage = async () => {
            if (!user || hasSyncedRef.current) return;

            try {
                setIsLoading(true);
                const profile = await ClientProfileService.getProfile();

                if (profile?.language && ['en', 'fr', 'ar'].includes(profile.language)) {
                    const dbLang = profile.language as Language;
                    if (dbLang !== language) {
                        setLanguageState(dbLang);
                        localStorage.setItem('psykho-lang', dbLang);
                    }
                }
                hasSyncedRef.current = true;
            } catch (error) {
                console.error('[LanguageProvider] Initial sync failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        syncLanguage();
    }, [user, language]);

    // Update HTML attributes and local persistence
    useEffect(() => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        setDirection(dir);
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        localStorage.setItem('psykho-lang', language);
    }, [language]);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);

        // Persist to DB if user is logged in
        if (user) {
            try {
                await ClientProfileService.updateProfile({ language: lang });
            } catch (error) {
                console.error('[LanguageProvider] Failed to persist language to DB:', error);
            }
        }
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
        <LanguageContext.Provider value={{ language, setLanguage, t, dir: direction, isLoading }}>
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
