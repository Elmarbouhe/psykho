import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export class ClientAuthService {
    /**
     * Registers a new user with email and password.
     */
    static async registerWithEmail(email: string, password: string): Promise<User> {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error('Registration Failed:', error);
            throw error;
        }
    }

    /**
     * Logs in an existing user with email and password.
     */
    static async loginWithEmail(email: string, password: string): Promise<User> {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            console.error('Login Failed:', error);
            throw error;
        }
    }

    /**
     * Initiates Google Sign-In flow.
     * @returns The signed-in Firebase User.
     */
    static async loginWithGoogle(): Promise<User> {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error('Login Failed:', error);
            throw error;
        }
    }

    /**
     * Signs out the current user.
     */
    static async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout Failed:', error);
            throw error;
        }
    }

    /**
     * Calls the backend API to synchronize the Firebase user with PostgreSQL.
     * @param token - Firebase ID Token
     */
    static async syncUserWithBackend(token: string) {
        try {
            const response = await fetch('/api/auth/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error('Failed to sync user with backend');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Sync Error:', error);
            throw error;
        }
    }
}
