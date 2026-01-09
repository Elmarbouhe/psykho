'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    User,
    MessageSquare,
    Calendar,
    BarChart3,
    Settings,
    LogOut,
    Leaf,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Dialogue', href: '/dialogue', icon: MessageSquare },
    { name: 'Check-in', href: '/check-in', icon: Calendar },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
];

interface SidebarContentProps {
    onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center px-6">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2"
                    onClick={onClose}
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Leaf className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Psykho
                    </span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                            )} />
                            {item.name}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border/50 p-4">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary font-bold">
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium">{user?.displayName || (user?.email?.split('@')[0]) || 'User'}</span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        logout();
                        onClose?.();
                    }}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex h-full w-64 flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="lg:hidden flex h-16 w-full items-center justify-between border-b border-border/50 bg-card/50 px-4 backdrop-blur-xl fixed top-0 z-50">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Leaf className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Psykho
                    </span>
                </Link>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-border/50 bg-card/95 backdrop-blur-2xl w-72">
                        <SidebarContent onClose={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
