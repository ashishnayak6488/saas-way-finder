'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RouteGuardProps {
    children: ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, loading, isPublicRoute, authChecked } = useAuth();

    useEffect(() => {
        // Only perform redirects when auth check is complete and not loading
        if (!loading && authChecked) {
            const isPublic = isPublicRoute(pathname);
            
            if (isPublic) {
                // If user is authenticated and on login page or root, redirect to dashboard
                if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
                    router.push('/dashboard');
                }
            } else {
                // If user is not authenticated and on protected route, redirect to login
                if (!isAuthenticated) {
                    router.push('/login');
                }
            }
        }
    }, [isAuthenticated, loading, authChecked, pathname, router, isPublicRoute]);

    // Show loading spinner during initial auth check
    if (loading || !authChecked) {
        return <LoadingSpinner />;
    }

    // For public routes, always render children
    if (isPublicRoute(pathname)) {
        return <>{children}</>;
    }

    // For protected routes, render children only if authenticated
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Show loading spinner while redirecting
    return <LoadingSpinner />;
}
