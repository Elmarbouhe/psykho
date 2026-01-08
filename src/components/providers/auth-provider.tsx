'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { ClientAuthService } from '@/services/client-auth-service';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen for Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            // 1. Trigger Google Sign-In
            const signedInUser = await ClientAuthService.loginWithGoogle();

            // 2. Get ID Token
            const token = await signedInUser.getIdToken();

            // 3. Sync with Backend
            await ClientAuthService.syncUserWithBackend(token);

            // State is updated automatically by onAuthStateChanged
        } catch (error) {
            console.error('Login flow failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await ClientAuthService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
