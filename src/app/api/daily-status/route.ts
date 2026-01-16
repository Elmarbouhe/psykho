import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/auth-service';
import { DailyLogService } from '@/services/daily-log-service';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const user = await AuthService.verifyAndSyncUser(token);

        const [hasLoggedToday, isBlooming] = await Promise.all([
            DailyLogService.hasLoggedToday(user.id),
            DailyLogService.getStreakStatus(user.id),
        ]);

        return NextResponse.json({
            hasLoggedToday,
            isBlooming,
        });
    } catch (error) {
        console.error('[API] /daily-status error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
