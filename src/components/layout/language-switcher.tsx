'use client';

import { useTranslation, Language } from '@/components/providers/language-provider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
    const { language, setLanguage } = useTranslation();

    const handleLanguageChange = (val: string) => {
        setLanguage(val as Language);
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[130px] bg-background/50 backdrop-blur-sm border-none shadow-none focus:ring-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
