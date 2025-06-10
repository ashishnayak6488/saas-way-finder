import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

interface ErrorResponse {
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract entity_uuid from URL
    const url = new URL(request.url);
    const entity_uuid = url.searchParams.get("entity_uuid");

    if (!entity_uuid) {
      return NextResponse.json<ErrorResponse>(
        { message: "Missing entity_uuid parameter" },
        { status: 400 }
      );
    }

    const token: string | null = await getAuthToken(request);

    if (!token) {
      return NextResponse.json<ErrorResponse>(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const logoFile = formData.get("logo");

    if (!logoFile) {
      return NextResponse.json<ErrorResponse>(
        { message: "No logo file provided" },
        { status: 400 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("logo", logoFile);

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization/addLogo?entity_uuid=${entity_uuid}`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json<ErrorResponse>(
        { message: errorData?.detail || "Failed to upload organization logo" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error uploading logo:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json<ErrorResponse>({ message }, { status: 500 });
  }
}
