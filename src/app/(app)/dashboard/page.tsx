'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome back, {user?.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-500 mb-4">You have successfully authenticated and synced with the database.</p>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md font-mono text-xs mb-4">
                        User ID: {user?.uid}<br />
                        Email: {user?.email}
                    </div>
                    <Button variant="destructive" onClick={() => logout()}>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
