'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Target, Map, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/providers/auth-provider';
import { useTranslation } from '@/components/providers/language-provider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function ProfilePage() {
    const { user } = useAuth();
    const { t, setLanguage, language } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        occupation: '',
        currentGoal: '',
        safeSpace: '',
        language: '',
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success && data.profile) {
                    setFormData({
                        name: data.profile.name || '',
                        age: data.profile.age?.toString() || '',
                        occupation: data.profile.occupation || '',
                        currentGoal: data.profile.currentGoal || '',
                        safeSpace: data.profile.safeSpace || '',
                        language: data.profile.language || 'en',
                    });
                    // Sync global language with fetched profile
                    if (data.profile.language) {
                        setLanguage(data.profile.language as any);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError(t('profile.error'));
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [user, setLanguage]); // Added setLanguage dependency, removed t to avoid loops if t changes (it shouldn't generally)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    age: formData.age ? parseInt(formData.age) : null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess(true);
                // Update global language on successful save
                if (formData.language) {
                    setLanguage(formData.language as any);
                }
            } else {
                throw new Error(data.error || t('profile.error'));
            }
        } catch (err: any) {
            setError(err.message || t('profile.error'));
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-border bg-card/50 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {t('profile.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('profile.description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <Label>{t('profile.language')}</Label>
                                <Select
                                    value={formData.language}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, language: val }))}
                                >
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="ar">العربية</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('profile.fullName')}</Label>
                                    <div className="relative">
                                        <User className="absolute rtl:right-3 rtl:left-auto left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder={t('profile.placeholders.name')}
                                            className="rtl:pr-9 rtl:pl-3 pl-9 bg-background/50"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">{t('profile.age')}</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder={t('profile.placeholders.age')}
                                        className="bg-background/50"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="occupation">{t('profile.occupation')}</Label>
                                <div className="relative">
                                    <Briefcase className="absolute rtl:right-3 rtl:left-auto left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="occupation"
                                        placeholder={t('profile.placeholders.occupation')}
                                        className="rtl:pr-9 rtl:pl-3 pl-9 bg-background/50"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentGoal">{t('profile.currentGoal')}</Label>
                                <div className="relative">
                                    <Target className="absolute rtl:right-3 rtl:left-auto left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="currentGoal"
                                        placeholder={t('profile.placeholders.currentGoal')}
                                        className="rtl:pr-9 rtl:pl-3 pl-9 bg-background/50"
                                        value={formData.currentGoal}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="safeSpace">{t('profile.safeSpace')}</Label>
                                <div className="relative">
                                    <Map className="absolute rtl:right-3 rtl:left-auto left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                        id="safeSpace"
                                        placeholder={t('profile.placeholders.safeSpace')}
                                        className="rtl:pr-9 rtl:pl-3 pl-9 bg-background/50 min-h-[100px]"
                                        value={formData.safeSpace}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="text-sm text-primary bg-primary/10 p-3 rounded-md">
                                    {t('profile.success')}
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('profile.saving')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="rtl:ml-2 rtl:mr-0 mr-2 h-4 w-4" />
                                        {t('profile.saveProfile')}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
