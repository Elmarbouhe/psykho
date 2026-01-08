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
            <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-200 to-teal-200 bg-clip-text text-transparent">
                        Welcome to the Sanctuary
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        A safe space for your mind to unwind and reflect.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 text-sm text-slate-400 text-center">
                        <p>Your journey to inner peace begins with a single step.</p>
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white transition-all duration-300 h-11"
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
