import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from '@/lib/ai/types';

interface ChatMessageProps {
    message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex w-full gap-3 py-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            {!isUser && (
                <Avatar className="h-8 w-8 border border-primary/20 bg-primary/5">
                    <AvatarFallback className="bg-transparent text-primary">
                        <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "relative max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                isUser
                    ? "bg-primary text-primary-foreground rounded-br-sm" // User styling
                    : "bg-muted/50 backdrop-blur-sm border border-border/50 text-foreground rounded-bl-sm" // AI styling
            )}>
                {/* 
                  Note: simple whitespace-pre-wrap handles basic paragraphs. 
                  For markdown support, we'd need a markdown renderer, but keeping it simple for now as per instructions.
                */}
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {isUser && (
                <Avatar className="h-8 w-8 border border-border bg-muted">
                    <AvatarFallback className="bg-transparent text-muted-foreground">
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </motion.div>
    );
}
