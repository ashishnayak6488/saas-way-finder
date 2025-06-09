import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(): Promise<NextResponse> {
  try {
    const cookie_name = process.env.SESSION_COOKIE_NAME || 'digital-signage';
    const cookieStore = cookies();

    const response = NextResponse.json({ success: true });

    // Clear authentication-related cookies
    response.cookies.delete(cookie_name);
    response.cookies.delete('user_info');

    return response;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Logout error:', error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
