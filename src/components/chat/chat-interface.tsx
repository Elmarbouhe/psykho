'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChat } from '@/hooks/use-ai-chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/providers/language-provider';

export function ChatInterface() {
    const { messages, sendMessage, isLoading, error } = useAIChat();
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation(); // Need to add keys to translation files later, using fallbacks/english for now in code or generic ids.

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const content = inputValue;
        setInputValue(''); // Clear immediately

        // Reset height of textarea (if we were doing auto-resize, relying on CSS for now)
        if (textareaRef.current) {
            textareaRef.current.focus();
        }

        await sendMessage(content);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] w-full max-w-4xl mx-auto bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden relative">

            {/* Header / Empty State */}
            {messages.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0 pointer-events-none opacity-50">
                    <div className="h-16 w-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Psykho Companion</h3>
                    <p className="text-muted-foreground max-w-md">
                        I'm here to listen, reflect, and support you. This is a safe space.
                        How are you feeling today?
                    </p>
                </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 relative z-10">
                <div className="space-y-2 pb-4">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2"
                        >
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Psykho is thinking...</span>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 my-2 text-sm text-destructive bg-destructive/10 rounded-lg text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-card/50 border-t border-border/50 backdrop-blur-sm z-20">
                <div className="relative flex items-end gap-2 bg-background/50 rounded-xl border border-border focus-within:ring-1 focus-within:ring-primary/50 transition-all p-2">
                    <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[50px] max-h-[150px] resize-none border-0 focus-visible:ring-0 bg-transparent text-base py-3"
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                        className={cn(
                            "mb-1 shrink-0 transition-all",
                            inputValue.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground/50">
                    AI can make mistakes. Please verify important information.
                </div>
            </div>
        </div>
    );
}
