'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/providers/auth-provider';
import { useTranslation } from '@/components/providers/language-provider';

export default function LoginPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, loginWithEmail, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleGoogleLogin = async () => {
        try {
            await login();
        } catch (error) {
            // Error is handled in provider
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await loginWithEmail(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password.');
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
                        {t('auth.loginTitle')}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {t('auth.loginSubtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('auth.loggingIn') : (
                                <>
                                    <LogIn className="rtl:ml-2 rtl:mr-0 mr-2 h-4 w-4" />
                                    {t('auth.loginButton')}
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative w-full text-center text-xs uppercase text-muted-foreground">
                        <span className="bg-card px-2">{t('auth.or')}</span>
                        <hr className="absolute inset-y-1/2 w-full border-border -z-10" />
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full h-11 transition-all duration-300 text-[10px] sm:text-sm"
                        size="lg"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="rtl:ml-2 rtl:mr-0 mr-2 h-4 w-4" alt={t('auth.googleAlt')} />
                        {t('auth.googleButton')}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    {t('auth.noAccount')}&nbsp;
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        {t('auth.signUpLink')}
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
