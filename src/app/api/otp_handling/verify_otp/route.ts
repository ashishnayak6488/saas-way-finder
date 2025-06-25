import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  message: string;
  detail?: string;
}

interface VerifyOtpRequest {
  identifier?: string;
  otp: string;
  type?: 'email' | 'phone';
  otpCode?: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  detail?: string;
  token?: string;
  user?: any|unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {

    const {identifier, otp, type, otpCode }: VerifyOtpRequest = await request.json();

    console.log("Received verification data:", { identifier, type, otp: otp || otpCode });
    
    const otpValue = otp || otpCode;
    
    if (!otpValue) {
      return NextResponse.json(
        { message: "OTP is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    if (!identifier) {
      return NextResponse.json(
        { message: "Either email or phone number is required" } as ErrorResponse,
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

    // Prepare request body based on whether it's email or phone verification
    const requestBody: { identifier?: string; otp: string, type?: string } = {
      otp: otpValue
    };

 
    requestBody.identifier = identifier
    requestBody.type = type;
    

    const response: Response = await fetch(`${apiUrl}/verify-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.detail || 'Failed to verify OTP' } as ErrorResponse,
        { status: response.status }
      );
    }

    // Create a NextResponse object
    const nextResponse: NextResponse = NextResponse.json(data);

    // Forward cookies from the backend response if any
    const setCookieHeader: string | null = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    
    return NextResponse.json(
      { message: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  }
}
