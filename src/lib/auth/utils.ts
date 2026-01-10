import { adminAuth } from '@/lib/firebase/admin';

/**
 * Reusable helper to verify the Firebase ID token in the Authorization header.
 * Returns the UID if valid, otherwise null.
 */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken.uid;
    } catch (error) {
        console.error('API Auth Error:', error);
        return null;
    }
}
