// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useAuth } from '@/src/context/AuthContext';
// import LoadingSpinner from '@/src/components/LoadingSpinner'; // Create this component if it doesn't exist

// export default function RouteGuard({ children }) {
//     const { isAuthenticated, loading, isPublicRoute } = useAuth();
//     const router = useRouter();
//     const pathname = usePathname();
//     const [isAuthorized, setIsAuthorized] = useState(false);

//     useEffect(() => {
//         // If not loading anymore, we can determine if the user is authorized
//         if (!loading) {
//             // If it's a public route, allow access
//             if (isPublicRoute(pathname)) {
//                 setIsAuthorized(true);
//             }
//             // If authenticated and not a public route, allow access
//             else if (isAuthenticated) {
//                 setIsAuthorized(true);
//             }
//             // If not authenticated and not a public route, redirect to login
//             else {
//                 router.push('/');
//             }
//         }
//     }, [isAuthenticated, loading, pathname, router, isPublicRoute]);

//     // Show loading state while checking authentication
//     if (loading || !isAuthorized) {
//         return <LoadingSpinner />;
//     }

//     // If authorized, render the children
//     return children;
// }

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import LoadingSpinner from '@/src/components/LoadingSpinner';

export default function RouteGuard({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, loading, isPublicRoute, authChecked } = useAuth();

    useEffect(() => {
        // Only perform redirects when auth check is complete
        if (!loading && authChecked) {
            // Handle public routes (login, etc.)
            if (isPublicRoute(pathname)) {
                if (isAuthenticated && (pathname === '/' || pathname === '/login')) {
                    router.push('/dashboard');
                }
            }
            // Handle protected routes
            else if (!isAuthenticated) {
                router.push('/login');
            }
        }
    }, [isAuthenticated, loading, authChecked, pathname, router, isPublicRoute]);

    // Show loading spinner only during initial auth check
    if (loading && !authChecked) {
        return <LoadingSpinner />;
    }

    // For public routes, always render children
    if (isPublicRoute(pathname)) {
        return children;
    }

    // For protected routes, render children only if authenticated
    return isAuthenticated ? children : <LoadingSpinner />;
}

