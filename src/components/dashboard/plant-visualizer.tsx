'use client';

import React from 'react';
import { useTranslation } from '@/components/providers/language-provider';
import { Sprout, Flower } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlantVisualizerProps {
    isBlooming: boolean;
    streakCount?: number; // Optional: if we want to show exact count later
}

export function PlantVisualizer({ isBlooming }: PlantVisualizerProps) {
    const { t } = useTranslation();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-col items-center justify-center space-y-3 cursor-help group">
                        <div className="relative">
                            {/* Background Glow */}
                            <div className={cn(
                                "absolute -inset-4 rounded-full blur-xl opacity-50 transition-colors duration-1000",
                                isBlooming ? "bg-primary/40" : "bg-emerald-500/20"
                            )} />

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                {isBlooming ? (
                                    <Flower className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                ) : (
                                    <Sprout className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                                )}
                            </motion.div>
                        </div>

                        <span className={cn(
                            "text-sm font-medium transition-colors duration-500",
                            isBlooming ? "text-primary" : "text-muted-foreground"
                        )}>
                            {isBlooming ? t('dashboard.plant.blooming') : t('dashboard.plant.growing')}
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('dashboard.plant.tooltip')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
