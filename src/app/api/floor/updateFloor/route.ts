import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    console.log("Received floor update payload");

    // Extract form data
    const floor_id = formData.get('floor_id') as string;
    const name = formData.get('name') as string;
    const building_id = formData.get('building_id') as string;
    const floor_number = formData.get('floor_number') as string;
    const description = formData.get('description') as string;
    const is_published = formData.get('is_published') as string;
    const floor_plan = formData.get('floor_plan') as File;

    if (!floor_id) {
      return NextResponse.json(
        { message: "Floor ID is required" },
        { status: 400 }
      );
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('floor_id', floor_id);
    
    if (name) backendFormData.append('name', name);
    if (building_id) backendFormData.append('building_id', building_id);
    if (floor_number) backendFormData.append('floor_number', floor_number);
    if (description) backendFormData.append('description', description);
    if (is_published) backendFormData.append('is_published', is_published);
    if (floor_plan && floor_plan.size > 0) {
      backendFormData.append('floor_plan', floor_plan);
    }

    let token = null;
    try {
      token = await getAuthToken(req);
    } catch (error) {
      console.error("Error getting auth token:", error);
    }

    if (!token) {
      const cookieStore = cookies();
      const cookieName = process.env.SESSION_COOKIE_NAME || "digital-signage";
      token = (await cookieStore).get(cookieName)?.value;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/${floor_id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
        },
        body: backendFormData,
        credentials: "include",
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      data = { message: responseText || "Invalid response from server" };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || data.detail || "Failed to update floor",
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("API route error:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "Request timed out. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
