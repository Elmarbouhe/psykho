'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { motion } from 'framer-motion';

export default function DialoguePage() {
    return (
        <div className="flex flex-col h-full w-full">
            <ChatInterface />
        </div>
    );
}
