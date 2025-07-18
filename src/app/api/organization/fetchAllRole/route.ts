import { NextResponse, NextRequest } from 'next/server';
// import { getAuthToken } from "@/middleware";

// Define the auth token type
interface AuthToken {
  access_token: string;
}

// Define the API response type
interface ApiResponse {
  success?: boolean;
  data?: any; // Adjust based on actual role data structure if known
  detail?: string;
  message?: string; // For error responses
}

// Define a custom error type for better error handling
class ApiError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Assume getAuthToken returns a Promise<AuthToken | null>
declare function getAuthToken(): Promise<AuthToken | null>;

export async function GET(request: NextRequest) {
  try {
    // Get auth token
    const token = await getAuthToken();
    if (!token || !token.access_token) {
      return NextResponse.json(
        { message: 'Unauthorized: Token missing or invalid' },
        { status: 401 }
      );
    }

    // Configure AbortController with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Make API request
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      throw new ApiError('Server configuration error: API base URL missing', 500);
    }

    const response = await fetch(`${apiBaseUrl}/v1/role`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access_token}`,
      },
      credentials: 'include',
      signal: controller.signal,
    });

    // Clear timeout on response
    clearTimeout(timeoutId);

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to fetch roles' },
        { status: response.status }
      );
    }

    // Create a NextResponse object
    const nextResponse = NextResponse.json(data);

    // Forward cookies from the backend response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    // Log error for debugging
    console.error('GET /api/roles error:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { message: 'Request timed out' },
        { status: 504 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}