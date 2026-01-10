import { auth } from '@/lib/firebase/client';
import { ChatMessage, ChatResponse } from '@/lib/ai/types';

export class AIService {
    private static async getAuthToken(): Promise<string> {
        if (!auth.currentUser) throw new Error('User not authenticated');
        return auth.currentUser.getIdToken();
    }

    /**
     * Sends a message to the AI Therapist securely via the Next.js API.
     */
    static async sendMessage(message: string, history: ChatMessage[] = []): Promise<string> {
        try {
            const token = await this.getAuthToken();

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message,
                    history, // We send only relevant history if needed
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to communicate with AI');
            }

            const data: ChatResponse = await response.json();
            return data.response;

        } catch (error) {
            console.error('[AIService] Error:', error);
            throw error;
        }
    }
}
