import { NextResponse, NextRequest } from "next/server";
import { getAuthToken } from "@/middleware";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse URL and extract entity_uuid
    const url = new URL(request.url);
    const entity_uuid = url.searchParams.get("entity_uuid");

    if (!entity_uuid) {
      return NextResponse.json(
        { message: "Missing entity_uuid parameter" },
        { status: 400 }
      );
    }

    const token = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization/addLogo/${entity_uuid}?entity_uuid=${entity_uuid}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData?.detail || "Failed to remove organization logo" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error removing logo:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
