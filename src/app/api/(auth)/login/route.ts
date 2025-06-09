import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // Type narrowing to ensure they are strings
    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append('username', username);
    urlEncodedData.append('password', password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/passauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData?.detail || 'Login failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const nextResponse = NextResponse.json({
      success: true,
      // Optionally add user: data.user_data
    });

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Login error:', error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
