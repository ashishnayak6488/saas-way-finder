import { NextResponse, NextRequest } from "next/server";
import { getAuthToken } from "@/middleware";

interface ErrorResponse {
  message: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token: string | null = await getAuthToken(request);

    if (!token) {
      return NextResponse.json<ErrorResponse>(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    // Construct backend API URL
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization/addLogo`
    );

    const controller = new AbortController();

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return NextResponse.json<ErrorResponse>(
        { message: errorData?.message || "Failed to fetch content" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json<ErrorResponse>({ message }, { status: 500 });
  }
}
