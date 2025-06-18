import { NextResponse } from "next/server";

interface LoginResponse {
  success?: boolean;
  error?: string;
  user?: unknown;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
}

export async function POST(
  request: Request
): Promise<NextResponse<LoginResponse>> {
  try {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    // Type narrowing to ensure they are strings
    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("username", username);
    urlEncodedData.append("password", password);

    console.log("Login Base url:", process.env.NEXT_PUBLIC_API_BASE_URL);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/passauth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return NextResponse.json(
        { error: errorData?.detail || errorData?.message || "Login failed" },
        { status: response.status }
      );
    }

    // Get response data and use it
    const responseData: unknown = await response.json();

    const nextResponse = NextResponse.json({
      success: true,
      user: responseData, // Now we're using the data
    });

    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Login error:", error);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
