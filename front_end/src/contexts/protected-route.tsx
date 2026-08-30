'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

/**
 * ProtectedRoute component - Redirects unauthenticated users to login
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();
        const pathname = usePathname();

        useEffect(() => {
                if (!isLoading && !isAuthenticated) {
                        const locale = pathname.split('/')[1]; // Extract locale from path
                        router.push(`/${locale}/login`);
                }
        }, [isAuthenticated, isLoading, router, pathname]);

        if (isLoading) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                        </div>
                );
        }

        return isAuthenticated ? <>{children}</> : null;
}

/**
 * PublicRoute component - Redirects authenticated users to dashboard
 */
export function PublicRoute({ children }: { children: ReactNode }) {
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();
        const pathname = usePathname();

        useEffect(() => {
                if (!isLoading && isAuthenticated) {
                        const locale = pathname.split('/')[1]; // Extract locale from path
                        router.push(`/${locale}/chat`);
                }
        }, [isAuthenticated, isLoading, router, pathname]);

        if (isLoading) {
                return (
                        <div className="flex items-center justify-center min-h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                        </div>
                );
        }

        return !isAuthenticated ? <>{children}</> : null;
}
