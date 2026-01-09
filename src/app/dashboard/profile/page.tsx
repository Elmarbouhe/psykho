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

export default function ProfilePage() {
    const { user } = useAuth();
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
                    });
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [user]);

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
            } else {
                throw new Error(data.error || 'Failed to update profile');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save profile.');
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
                            Your Profile
                        </CardTitle>
                        <CardDescription>
                            Provide some information to help your AI companion understand you better.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-9 bg-background/50"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="25"
                                        className="bg-background/50"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="occupation"
                                        placeholder="Software Engineer, Designer..."
                                        className="pl-9 bg-background/50"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentGoal">Current Goal</Label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="currentGoal"
                                        placeholder="Reduce anxiety, sleep better..."
                                        className="pl-9 bg-background/50"
                                        value={formData.currentGoal}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="safeSpace">"My Safe Space"</Label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                        id="safeSpace"
                                        placeholder="Describe a place that makes you feel peaceful (e.g., 'the beach at sunset')..."
                                        className="pl-9 bg-background/50 min-h-[100px]"
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
                                    Profile updated successfully!
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Profile
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
