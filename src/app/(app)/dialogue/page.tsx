'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { motion } from 'framer-motion';

export default function DialoguePage() {
    return (
        <div className="flex flex-col h-full space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Dialogue
                </h1>
                <p className="text-muted-foreground mt-1">
                    Your personal space for reflection and growth with Psykho.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1"
            >
                <ChatInterface />
            </motion.div>
        </div>
    );
}
