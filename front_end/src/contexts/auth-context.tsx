'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface AuthContextType {
        user: User | null;
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
        login: (email: string, password: string) => Promise<void>;
        register: (fullName: string, email: string, userName: string, password: string) => Promise<void>;
        logout: () => Promise<void>;
        updateProfile: (data: Partial<User>) => void;
        clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
        const [user, setUser] = useState<User | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        // Load user from localStorage on mount
        useEffect(() => {
                const loadUser = async () => {
                        try {
                                const storedUser = localStorage.getItem('auth_user');
                                if (storedUser) {
                                        setUser(JSON.parse(storedUser));
                                } else {
                                        // Default user for demo
                                        const defaultUser = MOCK_USERS.find(u => u.id === 'currentUser');
                                        if (defaultUser) {
                                                setUser(defaultUser);
                                                localStorage.setItem('auth_user', JSON.stringify(defaultUser));
                                        }
                                }
                        } catch (err) {
                                console.error('Failed to load user:', err);
                        } finally {
                                setIsLoading(false);
                        }
                };

                loadUser();
        }, []);

        const login = useCallback(async (email: string, password: string) => {
                setIsLoading(true);
                setError(null);

                try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 500));

                        const foundUser = MOCK_USERS.find(u => u.email === email) || {
                                id: `user_${Date.now()}`,
                                fullName: 'User',
                                userName: email.split('@')[0],
                                email,
                                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
                                status: 'online' as const,
                                bio: 'User profile bio.'
                        };

                        setUser(foundUser);
                        localStorage.setItem('auth_user', JSON.stringify(foundUser));
                } catch (err) {
                        const message = err instanceof Error ? err.message : 'Login failed';
                        setError(message);
                        throw err;
                } finally {
                        setIsLoading(false);
                }
        }, []);

        const register = useCallback(async (fullName: string, email: string, userName: string, password: string) => {
                setIsLoading(true);
                setError(null);

                try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 500));

                        const newUser: User = {
                                id: `user_${Date.now()}`,
                                fullName,
                                userName,
                                email,
                                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
                                status: 'online',
                                bio: 'New user profile bio.'
                        };

                        setUser(newUser);
                        localStorage.setItem('auth_user', JSON.stringify(newUser));
                } catch (err) {
                        const message = err instanceof Error ? err.message : 'Registration failed';
                        setError(message);
                        throw err;
                } finally {
                        setIsLoading(false);
                }
        }, []);

        const logout = useCallback(async () => {
                setIsLoading(true);
                setError(null);

                try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 300));

                        setUser(null);
                        localStorage.removeItem('auth_user');
                } catch (err) {
                        const message = err instanceof Error ? err.message : 'Logout failed';
                        setError(message);
                        throw err;
                } finally {
                        setIsLoading(false);
                }
        }, []);

        const updateProfile = useCallback((data: Partial<User>) => {
                if (user) {
                        const updatedUser = { ...user, ...data };
                        setUser(updatedUser);
                        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                }
        }, [user]);

        const clearError = useCallback(() => {
                setError(null);
        }, []);

        const value: AuthContextType = {
                user,
                isAuthenticated: !!user,
                isLoading,
                error,
                login,
                register,
                logout,
                updateProfile,
                clearError
        };

        return (
                <AuthContext.Provider value={value}>
                        {children}
                </AuthContext.Provider>
        );
}

export function useAuth() {
        const context = useContext(AuthContext);
        if (context === undefined) {
                throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
}
