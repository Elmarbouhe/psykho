import { adminAuth } from '@/lib/firebase/admin';
import prisma from '@/lib/prisma/prisma';

export class AuthService {
    /**
     * Verifies the Firebase ID token and ensures the user exists in the PostgreSQL database.
     * If the user doesn't exist, it creates a new record.
     * If the user exists, it updates their email if changed.
     * 
     * @param token - The Firebase ID token sent from the client
     * @returns The synchronized Prisma User object
     */
    static async verifyAndSyncUser(token: string) {
        try {
            // 1. Verify the ID token with Firebase Admin
            const decodedToken = await adminAuth.verifyIdToken(token);
            const { uid, email } = decodedToken;

            // 2. Upsert the user in the database (Create if not exists, Update email if exists)
            const user = await prisma.user.upsert({
                where: { id: uid },
                update: { email: email || null }, // Update email if provided
                create: {
                    id: uid,
                    email: email || null,
                },
            });

            return user;
        } catch (error) {
            console.error('Error in verifyAndSyncUser:', error);
            throw new Error('Authentication failed');
        }
    }
}
