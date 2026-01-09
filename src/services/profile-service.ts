import prisma from '@/lib/prisma/prisma';

export interface ProfileData {
    name?: string | null;
    age?: number | null;
    occupation?: string | null;
    currentGoal?: string | null;
    safeSpace?: string | null;
    language?: string | null;
}

export class ProfileService {
    /**
     * Fetches a user's profile from the database.
     */
    static async getProfile(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    name: true,
                    age: true,
                    occupation: true,
                    currentGoal: true,
                    safeSpace: true,
                    language: true,
                    email: true,
                },
            });
            return user;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    static async updateProfile(userId: string, data: ProfileData) {
        console.log(`[ProfileService] Updating profile for userId: ${userId}`, data);
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: data.name,
                    age: data.age,
                    occupation: data.occupation,
                    currentGoal: data.currentGoal,
                    safeSpace: data.safeSpace,
                    language: data.language,
                },
            });
            console.log(`[ProfileService] Profile updated successfully for ${userId}`);
            return updatedUser;
        } catch (error) {
            console.error(`[ProfileService] Error updating profile for ${userId}:`, error);
            throw error;
        }
    }
}
