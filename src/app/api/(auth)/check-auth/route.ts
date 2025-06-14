import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface JWTPayload {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
  sub?: string;
}

interface AuthResponse {
  isLoggedIn: boolean;
  user?: JWTPayload;
  error?: string;
}

export async function GET(): Promise<NextResponse<AuthResponse>> {
  try {
    const cookie_name = process.env.SESSION_COOKIE_NAME || 'digital-signage';
    const cookieStore = cookies();
    const token = (await cookieStore).get(cookie_name)?.value;

    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }

    try {
      // Decode the JWT payload
      const payload = token.split('.')[1];
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
      const userData: JWTPayload = JSON.parse(decodedPayload);

      if (!userData) {
        return NextResponse.json({ isLoggedIn: false });
      }

      const response = NextResponse.json({
        isLoggedIn: true,
        user: userData,
      });

      response.headers.set('Cache-Control', 'private, max-age=60');
      return response;
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      return NextResponse.json({ isLoggedIn: false });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { isLoggedIn: false, error: errorMessage },
      { status: 500 }
    );
  }
}
