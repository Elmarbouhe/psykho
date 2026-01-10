import { z } from 'zod';

/**
 * Chat Message Interface
 * Represents a single message in the chat history
 */
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

/**
 * Chat Response Interface
 * Represents the response from the AI chat API
 */
export interface ChatResponse {
    response: string;
}

/**
 * User Context Interface
 * Contains user profile information for personalized AI responses
 */
export interface UserContext {
    userId: string;
    name: string | null;
    age: number | null;
    occupation: string | null;
    currentGoal: string | null;
    safeSpace: string | null;
    language: string | null;
}

/**
 * Chat Request Validation Schema (Zod)
 * Used to validate incoming chat API requests
 */
export const ChatRequestSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string()
    })).optional().default([])
});

/**
 * Chat Provider Interface
 * Contract that all AI providers must implement
 */
export interface IChatProvider {
    generateResponse(messages: ChatMessage[], context: UserContext): Promise<string>;
}
