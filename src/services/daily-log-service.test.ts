import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DailyLogService } from './daily-log-service';
import prisma from '@/lib/prisma/prisma';
import { Mood } from '@prisma/client';

// Mock the prisma client
vi.mock('@/lib/prisma/prisma', () => ({
    default: {
        dailyLog: {
            create: vi.fn(),
            findMany: vi.fn(),
            count: vi.fn(),
        },
    },
}));

describe('DailyLogService', () => {
    const userId = 'user-123';
    const mood = Mood.JOYFUL;
    const reflection = 'Great job!';
    const action = 'Take a walk.';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createLog', () => {
        it('should create a daily log entry', async () => {
            const mockLog = { id: 'log-1', userId, mood, aiReflection: reflection, aiAction: action, createdAt: new Date() };
            // @ts-ignore
            prisma.dailyLog.create.mockResolvedValue(mockLog);

            const result = await DailyLogService.createLog(userId, mood, reflection, action);

            expect(prisma.dailyLog.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    mood,
                    aiReflection: reflection,
                    aiAction: action,
                },
            });
            expect(result).toEqual(mockLog);
        });
    });

    describe('getStreakStatus', () => {
        it('should return true if user logged in today, yesterday, and day before', async () => {
            const today = new Date();
            const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
            const dayBefore = new Date(today); dayBefore.setDate(dayBefore.getDate() - 2);

            const mockLogs = [
                { createdAt: today },
                { createdAt: yesterday },
                { createdAt: dayBefore },
            ];

            // @ts-ignore
            prisma.dailyLog.findMany.mockResolvedValue(mockLogs);

            const result = await DailyLogService.getStreakStatus(userId);
            expect(result).toBe(true);
        });

        it('should return false if a day is missing', async () => {
            const today = new Date();
            const dayBefore = new Date(today); dayBefore.setDate(dayBefore.getDate() - 2);

            const mockLogs = [
                { createdAt: today },
                { createdAt: dayBefore },
            ];

            // @ts-ignore
            prisma.dailyLog.findMany.mockResolvedValue(mockLogs);

            const result = await DailyLogService.getStreakStatus(userId);
            expect(result).toBe(false);
        });
    });

    describe('hasLoggedToday', () => {
        it('should return true if logs exist for today', async () => {
            // @ts-ignore
            prisma.dailyLog.count.mockResolvedValue(1);

            const result = await DailyLogService.hasLoggedToday(userId);
            expect(result).toBe(true);
        });

        it('should return false if no logs exist for today', async () => {
            // @ts-ignore
            prisma.dailyLog.count.mockResolvedValue(0);

            const result = await DailyLogService.hasLoggedToday(userId);
            expect(result).toBe(false);
        });
    });
});
