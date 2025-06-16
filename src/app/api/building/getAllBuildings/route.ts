// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken } from "@/middleware";
// import { cookies } from "next/headers";

// export async function GET(req: NextRequest) {
//   try {
//     let token = null;
//     try {
//       token = await getAuthToken(req);
//     } catch (error) {
//       console.error("Error getting auth token:", error);
//     }

//     if (!token) {
//       const cookieStore = cookies();
//       const cookieName = process.env.SESSION_COOKIE_NAME || "digital-signage";
//       token = (await cookieStore).get(cookieName)?.value;
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 30000);

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/building`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         //   Authorization: `Bearer ${token}`,
//         //   Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
//         },
//         // credentials: "include",
//         signal: controller.signal,
//       }
//     );

//     clearTimeout(timeoutId);

//     const responseText = await response.text();
//     let data;

//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error("Failed to parse response as JSON:", responseText);
//       data = { message: responseText || "Invalid response from server" };
//     }

//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           message: data.message || data.detail || "Failed to fetch buildings",
//           error: data,
//         },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (error: unknown) {
//     console.error("API route error:", error);

//     if (error instanceof Error && error.name === "AbortError") {
//       return NextResponse.json(
//         { message: "Request timed out. Please try again." },
//         { status: 504 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: error instanceof Error ? error.message : "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status_filter') || 'active';
    const skip = searchParams.get('skip') || '0';
    const limit = searchParams.get('limit') || '100'; // Add limit if your backend supports it

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

    // Build query string for the backend API
    const queryParams = new URLSearchParams({
      status_filter: statusFilter,
      skip: skip,
      ...(limit && { limit: limit }) // Only add limit if it exists
    });

    console.log("Making request to backend with query params:", queryParams.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/building?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
        },
        credentials: "include",
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error: unknown) {
      console.error("Failed to parse response as JSON:", responseText);
      data = { message: responseText || "Invalid response from server" };
    }

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || data.detail || "Failed to fetch buildings",
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
