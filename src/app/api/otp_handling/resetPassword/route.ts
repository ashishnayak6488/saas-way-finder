import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  message: string;
  detail?: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  detail?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { token, password }: ResetPasswordRequest = await request.json();

    console.log("Received token:", token);
    
    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" } as ErrorResponse,
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API base URL not configured" } as ErrorResponse,
        { status: 500 }
      );
    }

    // Call your backend API to reset the password
    const response: Response = await fetch(`${apiUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return NextResponse.json(
        { message: errorData?.message || 'Failed to reset password' } as ErrorResponse,
        { status: response.status }
      );
    }

    const data: ApiResponse = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    
    return NextResponse.json(
      { message: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  }
}
