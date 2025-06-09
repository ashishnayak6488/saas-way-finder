import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/middleware';

interface ErrorResponse {
  message: string;
  detail?: string;
}

interface PasswordResetRequest {
  email: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  detail?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email }: PasswordResetRequest = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    const token: string | null = await getAuthToken(request);
    
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" } as ErrorResponse,
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API base URL not configured" } as ErrorResponse,
        { status: 500 }
      );
    }

    // Call your backend API to request password reset
    const response: Response = await fetch(`${apiUrl}/request-password-reset`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    // For security reasons, always return a generic success message
    // regardless of whether the email exists or not
    if (!response.ok) {
      // Log the error but don't expose details to the client
      const errorData: ApiResponse = await response.json();
      console.error("Password reset request failed:", errorData);
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ 
      success: true, 
      message: "If the email exists, a password reset link will be sent." 
    });

  } catch (error: unknown) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "Request processed. If the email exists, a reset link will be sent." },
      { status: 200 } // Still return 200 for security
    );
  }
}
