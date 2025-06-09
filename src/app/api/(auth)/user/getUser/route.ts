import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = await getAuthToken(req);
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user_test`,
      {
        method: "GET",
        headers: {
          Accept: "application/json", // ✅ Fixed typo here
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch users" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
