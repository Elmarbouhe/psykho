import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth-service';
import { ServerAIService } from '@/services/server-ai-service';
import { DailyLogService } from '@/services/daily-log-service';
import { Mood } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const user = await AuthService.verifyAndSyncUser(token);

        const body = await req.json();
        const { mood } = body;

        if (!mood || !Object.values(Mood).includes(mood)) {
            return NextResponse.json({ error: 'Invalid mood' }, { status: 400 });
        }

        // Generate AI Insight
        const insight = await ServerAIService.generateDailyInsight(mood);

        // Persist Log
        await DailyLogService.createLog(user.id, mood, insight.reflection, insight.action);

        // Check updated streak
        const isBlooming = await DailyLogService.getStreakStatus(user.id);

        return NextResponse.json({
            reflection: insight.reflection,
            action: insight.action,
            isBlooming,
        });
    } catch (error) {
        console.error('[API] /daily-checkin error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
