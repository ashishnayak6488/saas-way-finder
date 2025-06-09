import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  message: string;
  detail?: string;
}

interface SendEmailOtpRequest {
  email: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  detail?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email }: SendEmailOtpRequest = await request.json();

    console.log("Received email:", email);
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" } as ErrorResponse,
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

    const response: Response = await fetch(`${apiUrl}/send-email-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.detail || 'Failed to send OTP' } as ErrorResponse,
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    
    return NextResponse.json(
      { message: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  }
}
