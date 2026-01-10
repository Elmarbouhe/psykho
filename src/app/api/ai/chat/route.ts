import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth/utils';
import prisma from '@/lib/prisma/prisma';
import { GeminiProvider } from '@/lib/ai/providers/gemini';
import { ChatRequestSchema, UserContext, ChatMessage } from '@/lib/ai/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
    try {
        // 1. Authentication (Security)
        const uid = await getUserIdFromRequest(request);
        if (!uid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Input Validation (Zod)
        const body = await request.json();
        const validation = ChatRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid Input', details: validation.error }, { status: 400 });
        }

        const { message, history } = validation.data;

        // 3. Fetch User Context (Profile) from Database using Prisma
        const userProfile = await prisma.user.findUnique({
            where: { id: uid },
            select: {
                id: true,
                name: true,
                age: true,
                occupation: true,
                currentGoal: true,
                safeSpace: true,
                language: true,
            }
        });

        if (!userProfile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        // 4. Transform to Context Object
        const userContext: UserContext = {
            userId: userProfile.id,
            name: userProfile.name,
            age: userProfile.age,
            occupation: userProfile.occupation,
            currentGoal: userProfile.currentGoal,
            safeSpace: userProfile.safeSpace,
            language: userProfile.language,
        };

        // 5. Initialize AI Provider
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Configuration Error', details: 'Missing GEMINI_API_KEY' }, { status: 503 });
        }

        let aiProvider;
        try {
            aiProvider = new GeminiProvider(GEMINI_API_KEY);
        } catch (initError: any) {
            return NextResponse.json({ error: 'Provider Init Error', details: initError.message }, { status: 500 });
        }

        // 6. Execute AI Service
        // Combine history + current message for the provider
        const fullMessages: ChatMessage[] = [
            ...history.map(h => ({ role: h.role as 'user' | 'model', content: h.content })),
            { role: 'user', content: message }
        ];

        let responseText;
        try {
            responseText = await aiProvider.generateResponse(fullMessages, userContext);
        } catch (genError: any) {
            console.error('Gemini Generation Error:', genError);
            return NextResponse.json({ error: 'AI Generation Error', details: genError.message || 'Gemini API Failed' }, { status: 502 });
        }

        // 7. Return Result
        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error('[AI Chat API] Critical Error:', error);
        console.error('[AI Chat API] Stack:', error.stack);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message || 'Unknown Error'
        }, { status: 500 });
    }
}
