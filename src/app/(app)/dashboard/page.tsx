'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useTranslation } from '@/components/providers/language-provider';
import { MoodSelector } from '@/components/dashboard/mood-selector';
import { InsightCard } from '@/components/dashboard/insight-card';
import { PlantVisualizer } from '@/components/dashboard/plant-visualizer';
import { Mood } from '@prisma/client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useTranslation();

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoggedToday, setHasLoggedToday] = useState(false);
    const [isBlooming, setIsBlooming] = useState(false);

    // Insight state valid for the session
    const [insight, setInsight] = useState<{ reflection: string; action: string } | null>(null);

    // Fetch initial status
    useEffect(() => {
        const fetchStatus = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const res = await fetch('/api/daily-status', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setHasLoggedToday(data.hasLoggedToday);
                    setIsBlooming(data.isBlooming);
                    // Note: If they already logged today, we won't have the insight text unless we fetch it.
                    // For MVP, if they logged today, we might just show "You have already checked in".
                    // Or we could fetch the latest log.
                    // The current spec doesn't explicitly say we must show the old insight if reload.
                    // But "The Sanctuary" implies persistence. 
                    // To keep it simple for MVP: if hasLoggedToday, we show a "Welcome back" or "Check-in complete" state 
                    // unless we store the insight in state/localstorage or fetch it.
                    // Let's assume for now we just show the Plant and a "Come back tomorrow" message if logged,
                    // OR if the user JUST logged in this session, we show the insight.
                }
            } catch (error) {
                console.error('Failed to fetch daily status', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
    }, [user]);

    const handleMoodSelect = async (mood: Mood) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/daily-checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ mood }),
            });

            if (!res.ok) throw new Error('Failed to check in');

            const data = await res.json();
            setInsight({
                reflection: data.reflection,
                action: data.action,
            });
            setIsBlooming(data.isBlooming);
            setHasLoggedToday(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="flex flex-col items-center justify-start min-h-[80vh] w-full max-w-5xl mx-auto px-4 py-8 gap-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center text-center gap-2"
            >
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        {t('dashboard.title')}
                    </h1>
                    <PlantVisualizer isBlooming={isBlooming} />
                </div>

                <p className="text-muted-foreground text-lg max-w-lg mt-4">
                    {t('dashboard.subtitle')}
                </p>
            </motion.div>

            {/* Main Content Area */}
            <div className="w-full max-w-2xl mt-8">
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-pulse h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                ) : !hasLoggedToday ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <MoodSelector onSelect={handleMoodSelect} isLoading={isLoading} />
                    </motion.div>
                ) : (
                    <div className="w-full">
                        {insight ? (
                            <InsightCard reflection={insight.reflection} action={insight.action} />
                        ) : (
                            <Card className="bg-card/50 backdrop-blur-xl text-center p-8">
                                <CardContent className="pt-6">
                                    <p className="text-xl text-muted-foreground">{t('dashboard.plant.tooltip')}</p>
                                    <p className="mt-4 text-sm text-muted-foreground/60">
                                        {t('dashboard.alreadyCheckedIn')}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
