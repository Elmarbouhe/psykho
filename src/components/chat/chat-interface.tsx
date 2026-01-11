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
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] w-full bg-background/30 relative">

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto w-full relative">
                {messages.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0 pointer-events-none opacity-50">
                        <div className="h-16 w-16 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{t('chat.title')}</h3>
                        <p className="text-muted-foreground max-w-md">
                            {t('chat.subtitle')} {t('chat.question')}
                        </p>
                    </div>
                )}

                <div className="max-w-4xl mx-auto w-full p-4 space-y-4 min-h-full flex flex-col justify-end">
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
                            <span>{t('chat.thinking')}</span>
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
            </div>

            {/* Input Area - Fixed at Bottom */}
            <div className="flex-none p-4 bg-background/80 backdrop-blur-md border-t border-border z-20 w-full">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="relative flex items-end gap-2 bg-muted/30 rounded-2xl border border-border focus-within:ring-1 focus-within:ring-primary/20 transition-all p-2">
                        <Textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('chat.inputPlaceholder')}
                            className="min-h-[44px] max-h-[150px] resize-none border-0 focus-visible:ring-0 bg-transparent text-base py-3 px-3 placeholder:text-muted-foreground/50"
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                            className={cn(
                                "mb-0.5 shrink-0 transition-all rounded-xl h-10 w-10",
                                inputValue.trim() ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ms-0.5" />}
                        </Button>
                    </div>
                    <div className="mt-2 text-[10px] text-center text-muted-foreground/40 font-medium">
                        {t('chat.disclaimer')}
                    </div>
                </div>
            </div>
        </div>
    );
}
