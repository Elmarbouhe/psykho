'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';
import { Mood } from '@prisma/client';
import { Smile, Cloud, Frown, AlertCircle } from 'lucide-react';

interface MoodSelectorProps {
    onSelect: (mood: Mood) => void;
    isLoading?: boolean;
}

export function MoodSelector({ onSelect, isLoading = false }: MoodSelectorProps) {
    const { t } = useTranslation();

    const moods = [
        {
            id: Mood.JOYFUL,
            label: t('dashboard.mood.joyful'),
            icon: Smile,
            color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
        },
        {
            id: Mood.CALM,
            label: t('dashboard.mood.calm'),
            icon: Cloud,
            color: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
        },
        {
            id: Mood.SAD,
            label: t('dashboard.mood.sad'),
            icon: Frown,
            color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
        },
        {
            id: Mood.ANXIOUS,
            label: t('dashboard.mood.anxious'),
            icon: AlertCircle,
            color: 'bg-orange-100 hover:bg-orange-200 text-orange-700',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {moods.map((mood) => (
                <Button
                    key={mood.id}
                    variant="outline"
                    onClick={() => onSelect(mood.id)}
                    disabled={isLoading}
                    className={cn(
                        'h-24 flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 hover:scale-[1.02]',
                        mood.color,
                        'border-transparent hover:border-current'
                    )}
                >
                    <mood.icon className="h-8 w-8" />
                    <span className="font-semibold">{mood.label}</span>
                </Button>
            ))}
        </div>
    );
}
