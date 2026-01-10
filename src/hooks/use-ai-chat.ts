import { useState, useCallback } from 'react';
import { AIService } from '@/services/ai-service';
import { ChatMessage } from '@/lib/ai/types';

interface UseAIChatReturn {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearChat: () => void;
}

export function useAIChat(): UseAIChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        setIsLoading(true);
        setError(null);

        // Optimistic Update: Add user message immediately
        const userMsg: ChatMessage = { role: 'user', content };
        setMessages((prev) => [...prev, userMsg]);

        try {
            // Get AI Response (passing current history)
            // Note: We don't include the *just added* message in history argument if the API expects "history" separate from "current message"
            // Our API definition was: body: { message, history }
            const responseText = await AIService.sendMessage(content, messages);

            const aiMsg: ChatMessage = { role: 'model', content: responseText };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
            // Optional: Remove user message if failed? Or just show error?
            // Keeping it simple for now.
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
    };
}
