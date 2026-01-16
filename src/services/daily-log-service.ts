import prisma from '@/lib/prisma/prisma';
import { Mood } from '@prisma/client';

export class DailyLogService {
    /**
     * Creates a new daily log entry.
     * @param userId The ID of the user.
     * @param mood The mood selected by the user.
     * @param reflection The AI-generated reflection.
     * @param action The AI-generated 5-minute action.
     */
    static async createLog(userId: string, mood: Mood, reflection: string, action: string) {
        return prisma.dailyLog.create({
            data: {
                userId,
                mood,
                aiReflection: reflection,
                aiAction: action,
            },
        });
    }

    /**
     * Checks if the user has logged in for the last 3 consecutive days (including today).
     * @param userId The ID of the user.
     * @returns True if streak >= 3, otherwise false.
     */
    static async getStreakStatus(userId: string): Promise<boolean> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // We need to check logs for:
        // 1. Today (optional, maybe they just logged in)
        // 2. Yesterday
        // 3. Day before Yesterday

        // Actually, "Streak >= 3" means they logged in today, yesterday, and the day before.
        // Or if they haven't logged in today yet, but logged in yesterday, day before, and day before that?
        // The requirement says: "If the user has logged in 3 days in a row, show the plant as 'Blooming'".
        // This usually implies a current active streak.

        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const logs = await prisma.dailyLog.findMany({
            where: {
                userId,
                createdAt: {
                    gte: threeDaysAgo,
                },
            },
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Simple robust logic: grouping by day
        const uniqueDays = new Set(
            logs.map((log) => {
                const d = new Date(log.createdAt);
                d.setHours(0, 0, 0, 0);
                return d.toISOString();
            })
        );

        // Check for today, yesterday, dayBefore
        const d1 = new Date(today);
        const d2 = new Date(today); d2.setDate(d2.getDate() - 1);
        const d3 = new Date(today); d3.setDate(d3.getDate() - 2);

        const hasToday = uniqueDays.has(d1.toISOString());
        const hasYesterday = uniqueDays.has(d2.toISOString());
        const hasDayBefore = uniqueDays.has(d3.toISOString());

        return hasToday && hasYesterday && hasDayBefore;
    }

    /**
     * Checks if the user has already logged a mood today.
     */
    static async hasLoggedToday(userId: string): Promise<boolean> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const count = await prisma.dailyLog.count({
            where: {
                userId,
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        return count > 0;
    }
}
