'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/auth-provider';
import { useTranslation } from '@/components/providers/language-provider';

export default function RegisterPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, user, loading } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {t('auth.registerTitle')}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t('auth.registerSubtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('auth.emailLabel')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('auth.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('auth.passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-background/50"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 transition-all duration-300"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('auth.creatingAccount') : (
                                <>
                                    <UserPlus className="rtl:ml-2 rtl:mr-0 mr-2 h-4 w-4" />
                                    {t('auth.registerButton')}
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full text-center text-xs uppercase text-muted-foreground">
                        <span className="bg-card px-2">{t('auth.or')}</span>
                        <hr className="absolute inset-y-1/2 w-full border-border -z-10" />
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">
                            <ArrowLeft className="rtl:ml-2 rtl:mr-0 mr-2 h-4 w-4" />
                            {t('auth.backToLogin')}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
