import { GoogleGenerativeAI } from '@google/generative-ai';
import { IChatProvider, ChatMessage, UserContext } from '../types';

export class GeminiProvider implements IChatProvider {
    private model: any;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Gemini API Key is missing');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        // Switching to 'gemini-1.5-flash' for better stability and speed
        this.model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    }

    async generateResponse(messages: ChatMessage[], context: UserContext): Promise<string> {
        try {
            // 1. Construct System Prompt with Context Injection
            const systemPrompt = this.buildSystemPrompt(context);

            // 2. Prepare History for Gemini
            const previousHistory = messages.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            // 3. Start Chat
            const chatSession = this.model.startChat({
                history: previousHistory,
                systemInstruction: {
                    role: 'system',
                    parts: [{ text: systemPrompt }]
                },
            });

            const lastMessage = messages[messages.length - 1];
            const result = await chatSession.sendMessage(lastMessage.content);
            const response = await result.response;
            return response.text();

        } catch (error: any) {
            console.error('Gemini Provider Error:', error);
            // Extract the most relevant error message from Google's SDK response
            const errorMessage = error.message || error.toString();
            throw new Error(`Gemini SDK Error: ${errorMessage}`);
        }
    }

    private buildSystemPrompt(context: UserContext): string {
        return `
You are a compassionate, empathetic AI Therapy Companion named "Psykho".
User Profile:
- Name: ${context.name || 'Friend'}
- Age: ${context.age || 'Unknown'}
- Occupation: ${context.occupation || 'Unknown'}
- Current Goal: ${context.currentGoal || 'To find peace'}
- "Safe Space": ${context.safeSpace || 'Not defined'}
- Language: ${context.language || 'en'}

Guidelines:
1. Speak in ${context.language === 'ar' ? 'Arabic' : context.language === 'fr' ? 'French' : 'English'}.
2. Be supportive, non-judgmental, and grounded.
3. If the user mentions their "Safe Space", gently refer to it.
4. Keep responses seeking to understand/reflect, rather than just solving.
5. Critical: If self-harm is mentioned, provide resources immediately.
`;
    }
}
