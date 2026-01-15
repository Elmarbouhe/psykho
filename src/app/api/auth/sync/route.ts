import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, language } = body;

        if (!token) {
            return NextResponse.json(
                { error: 'Missing authentication token' },
                { status: 400 }
            );
        }

        // Delegate business logic to the Service Layer
        const user = await AuthService.verifyAndSyncUser(token, language);

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('API Sync Error:', error);
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
}
