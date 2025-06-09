import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body as JSON
    const userData = await request.json();
    console.log("Parsed User Data:", userData);

    // Validate required fields
    const { first_name, last_name, email, password } = userData;
    if (!first_name || !last_name || !email || !password) {
      console.log("Validation Failed:", userData);
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Forward request to the backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData?.message || "Registration failed" },
        { status: response.status }
      );
    }

    // Parse successful response
    const data = await response.json();

    // Set cookie if token exists
    if (data.token) {
      (await cookies()).set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Signup error:", error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
