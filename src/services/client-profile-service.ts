import { auth } from '@/lib/firebase/client';

export interface ProfileData {
    name?: string | null;
    age?: number | null;
    occupation?: string | null;
    currentGoal?: string | null;
    safeSpace?: string | null;
    language?: string | null;
}

export class ClientProfileService {
    private static async getAuthToken(): Promise<string> {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        return user.getIdToken();
    }

    /**
     * Fetches the user profile from the database via the API route.
     */
    static async getProfile() {
        try {
            const token = await this.getAuthToken();
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch profile');
            }

            const data = await response.json();
            return data.profile;
        } catch (error) {
            console.error('[ClientProfileService] Error fetching profile:', error);
            throw error;
        }
    }

    /**
     * Updates the user profile via the API route.
     */
    static async updateProfile(data: ProfileData) {
        try {
            const token = await this.getAuthToken();
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update profile');
            }

            const result = await response.json();
            return result.profile;
        } catch (error) {
            console.error('[ClientProfileService] Error updating profile:', error);
            throw error;
        }
    }
}
