import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  try {
    const buildingData = await req.json();
    console.log("Received building update payload:", buildingData);

    const { building_id, ...updateData } = buildingData;

    if (!building_id) {
      return NextResponse.json(
        { message: "Building ID is required" },
        { status: 400 }
      );
    }

    const dataToSend = {
      name: updateData.name || "",
      address: updateData.address || "",
      description: updateData.description || "",
    };

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
    const timeoutId = setTimeout(() => controller.abort(), 100000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/building/${building_id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
        },
        body: JSON.stringify(dataToSend),
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
          message: data.message || data.detail || "Failed to update building",
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
