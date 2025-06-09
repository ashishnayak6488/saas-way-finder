import { NextRequest, NextResponse } from 'next/server';

interface ErrorResponse {
  message: string;
  detail?: string;
}

interface SendPhoneOtpRequest {
  phone: string;
  phoneNumber?: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  detail?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { phone, phoneNumber }: SendPhoneOtpRequest = await request.json();

    console.log("Received phone:", phone || phoneNumber);
    
    const phoneNum = phone || phoneNumber;
    
    if (!phoneNum) {
      return NextResponse.json(
        { message: "Phone number is required" } as ErrorResponse,
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

    const response: Response = await fetch(`${apiUrl}/send-phone-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNum }),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.detail || 'Failed to send phone OTP' } as ErrorResponse,
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
