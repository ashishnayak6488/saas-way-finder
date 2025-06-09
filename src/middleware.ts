import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Type for the cookie store
interface Cookie {
  name: string;
  value: string;
}

// Function to get the authentication token from cookies
export async function getAuthToken(req: NextRequest): Promise<string | null> {
  try {
    const cookieName: string = process.env.SESSION_COOKIE_NAME || 'digital-signage';
    console.log('Looking for cookie:', cookieName);

    const nextCookies = await cookies();
    const nextAuthSessionToken: Cookie | undefined = nextCookies.get(cookieName);

    console.log('Cookie name:', cookieName);
    console.log('NextAuth session token found:', nextAuthSessionToken ? 'Yes' : 'No');

    if (nextAuthSessionToken) {
      return nextAuthSessionToken.value;
    }

    return null;
  } catch (error: unknown) {
    console.error('Error in getAuthToken:', error);
    return null;
  }
}

// Middleware function with TypeScript
export async function middleware(request: NextRequest): Promise<NextResponse> {
  console.log('Middleware executed for:', request.nextUrl.pathname);
  console.log('Middleware executed');
  const cookieName: string = process.env.SESSION_COOKIE_NAME || 'digital-signage';
  const nextCookies = await cookies();
  const nextAuthSessionToken: Cookie | undefined = nextCookies.get(cookieName);

  // Handle logout route specifically
  if (request.nextUrl.pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));

    // Clear the auth cookie on logout
    response.cookies.delete(cookieName);

    return response;
  }

  // Check if user is on public routes
  if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname === '/reset_password' ||
    request.nextUrl.pathname === '/otpverify' ||
    request.nextUrl.pathname === '/termandcondition' ||
    request.nextUrl.pathname.startsWith('/createapassword')
  ) {
    // If token exists and is valid, redirect to dashboard
    if (nextAuthSessionToken?.value) {
      console.log('Token found, validating...');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${nextAuthSessionToken.value}`,
            Authorization: `Bearer ${nextAuthSessionToken.value}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          // Clear invalid token
          const redirectResponse = NextResponse.redirect(new URL('/', request.url));
          redirectResponse.cookies.delete(cookieName);
          return redirectResponse;
        }
      } catch (error: unknown) {
        console.error('Token validation error:', error);
        // Clear invalid token
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete(cookieName);
        return redirectResponse;
      }
    }
    return NextResponse.next();
  }

  // For all other protected routes
  if (!nextAuthSessionToken) {
    console.error('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Validate token with FastAPI backend
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${cookieName}=${nextAuthSessionToken.value}`,
        Authorization: `Bearer ${nextAuthSessionToken.value}`,
      },
      next: { revalidate: 1 },
      credentials: 'include',
    });

    if (!response.ok) {
      console.log('Token validation failed, redirecting to login');
      // Clear invalid token
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.cookies.delete(cookieName);
      return redirectResponse;
    }
  } catch (error: unknown) {
    console.error('Error validating token:', error);
    // Clear invalid token
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
    redirectResponse.cookies.delete(cookieName);
    return redirectResponse;
  }

  console.log('Token validated, proceeding to next middleware or handler');
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: [
    // Include logout path
    '/logout',
    // Exclude public routes and static assets
    '/((?!signup|login|api|$|/$|_next/static|_next/image|favicon.ico|placeholder.svg|forgot-password|reset-password|verify-otp|terms-and-conditions|privacy-policy|about|contact|help|verify-email|password-reset).*)',
  ],
};