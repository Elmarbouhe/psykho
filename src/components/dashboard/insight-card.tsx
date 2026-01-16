'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/components/providers/language-provider';
import { motion } from 'framer-motion';

interface InsightCardProps {
    reflection: string;
    action: string;
}

export function InsightCard({ reflection, action }: InsightCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-4"
        >
            {/* Reflection Card */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-medium text-primary">
                        {t('dashboard.insight.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed text-foreground/90 italic">
                        "{reflection}"
                    </p>
                </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                        {t('dashboard.action.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium text-foreground">
                        {action}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
