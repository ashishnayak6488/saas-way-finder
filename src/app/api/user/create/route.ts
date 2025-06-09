import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

interface ErrorResponse {
  message: string;
  detail?: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  orgId: string;
}

interface ApiUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  organization_id: string;
}

interface ApiResponse {
  data?: any;
  message?: string;
  success?: boolean;
  detail?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const controller = new AbortController();

  try {
    // Parse the request body
    const userData: CreateUserRequest = await request.json();
    console.log("Creating user with data:", userData);

    // Validate required fields
    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.role ||
      !userData.orgId
    ) {
      return NextResponse.json(
        { message: "All fields are required" } as ErrorResponse,
        { status: 400 }
      );
    }

    // Get auth token for the request
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

    // Set up request timeout
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Prepare the data for the backend API
    const apiUserData: ApiUserData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      organization_id: userData.orgId,
    };

    // Make a request to the backend API
    const response: Response = await fetch(`${apiUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiUserData),
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return NextResponse.json(
        {
          message:
            errorData?.detail || errorData?.message || "Failed to create user",
        } as ErrorResponse,
        { status: response.status }
      );
    }

    // Parse the successful response
    const data: ApiResponse = await response.json();

    // Return the successful response
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error("User creation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json({ message: errorMessage } as ErrorResponse, {
      status: 500,
    });
  } finally {
    // Clean up the abort controller
    controller.abort();
  }
}
