'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { ClientAuthService } from '@/services/client-auth-service';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    loginWithEmail: async () => { },
    register: async () => { },
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
        } catch (error) {
            console.error('Login flow failed:', error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const signedInUser = await ClientAuthService.loginWithEmail(email, password);
            const token = await signedInUser.getIdToken();
            await ClientAuthService.syncUserWithBackend(token);
        } catch (error) {
            console.error('Email Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const newUser = await ClientAuthService.registerWithEmail(email, password);
            const token = await newUser.getIdToken();
            await ClientAuthService.syncUserWithBackend(token);
        } catch (error) {
            console.error('Email Registration failed:', error);
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
        <AuthContext.Provider value={{ user, loading, login, loginWithEmail, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
