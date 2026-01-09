'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
    const { login, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleLogin = async () => {
        try {
            await login();
        } catch (error) {
            // Error is logged in provider
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
                        Welcome to the Sanctuary
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        A safe space for your mind to unwind and reflect.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50 text-sm text-muted-foreground text-center">
                        <p>Your journey to inner peace begins with a single step.</p>
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="w-full transition-all duration-300 h-11"
                        size="lg"
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
