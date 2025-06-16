import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const orgData = await req.json();
    console.log("Received payload in API route:", orgData);

    const dataToSend = {
      entity_type: orgData.entity_type || "parent",
      name: orgData.name || "",
      description: orgData.description || "",
      headcount: orgData.headcount || 0,
      domain: orgData.domain || "",
      parent_uuid: orgData.parent_uuid,
      address_id: orgData.address_id || 0,
      maxLimit: orgData.numberOfScreen ?? 0,
    };

    console.log("Data to send to backend:", dataToSend);

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
      console.log(
        "Token from cookies fallback:",
        token ? "Found" : "Not found"
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    console.log("Making request to backend with token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Cookie: `${
            process.env.SESSION_COOKIE_NAME || "digital-signage"
          }=${token}`,
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
    } catch (error:unknown) {
      console.error("Failed to parse response as JSON:", responseText);
      data = { message: responseText || "Invalid response from server" };
    }

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data.message || data.detail || "Failed to create organization",
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
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
