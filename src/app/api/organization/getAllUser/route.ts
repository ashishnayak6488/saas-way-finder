import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

interface ErrorResponse {
  message: string;
}

interface UserData {
  // Add specific properties based on your API response structure
  // Example:
  // id: string;
  // name: string;
  // email: string;
  // role: string;
  // organizationId?: string;
  [key: string]: any; // Remove this once you define specific properties
}

interface ApiResponse {
  data?: UserData[];
  message?: string;
  success?: boolean;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const controller = new AbortController();
  
  try {
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

    const response: Response = await fetch(
      `${apiUrl}/v1/user/getAllUser`,
      {
        method: "GET",
        headers: {
          'Accept': "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        credentials: "include",
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch users" } as ErrorResponse,
        { status: response.status }
      );
    }

    const data: ApiResponse = await response.json();

    // Create a NextResponse object
    const nextResponse: NextResponse = NextResponse.json(data);

    // Forward cookies from the backend response
    const setCookieHeader: string | null = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    console.error("Get Users error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { message: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  } finally {
    // Clean up the abort controller
    controller.abort();
  }
}
