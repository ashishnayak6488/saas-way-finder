import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    console.log("Received floor creation payload");

    // Extract form data
    const name = formData.get('name') as string;
    const building_id = formData.get('building_id') as string;
    const floor_number = formData.get('floor_number') as string;
    const description = formData.get('description') as string;
    const is_published = formData.get('is_published') as string;
    const floor_plan = formData.get('floor_plan') as File;

    if (!name || !building_id || !floor_number) {
      return NextResponse.json(
        { message: "Name, building_id, and floor_number are required" },
        { status: 400 }
      );
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('name', name);
    backendFormData.append('building_id', building_id);
    backendFormData.append('floor_number', floor_number);
    
    if (description) {
      backendFormData.append('description', description);
    }
    
    backendFormData.append('is_published', is_published || 'true');
    
    if (floor_plan && floor_plan.size > 0) {
      backendFormData.append('floor_plan', floor_plan);
    }

    let token = null;
    try {
      token = await getAuthToken(req);
      console.log("Token from getAuthToken:", token ? "Found" : "Not found");
    } catch (error) {
      console.error("Error getting auth token:", error);
    }

    if (!token) {
      const cookieStore = cookies();
      const cookieName = process.env.SESSION_COOKIE_NAME || "digital-signage";
      token = (await cookieStore).get(cookieName)?.value;
      console.log("Token from cookies fallback:", token ? "Found" : "Not found");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased timeout for file upload

    console.log("Making request to backend with token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor`,
      {
        method: "POST",
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

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || data.detail || "Failed to create floor",
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
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
