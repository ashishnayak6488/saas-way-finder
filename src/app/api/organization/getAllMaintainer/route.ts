// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken } from "@/middleware";

// interface ErrorResponse {
//   message: string;
// }

// interface MaintainerData {
//   // Add specific properties based on your API response structure
//   // Example:
//   // id: string;
//   // name: string;
//   // email: string;
//   // role: string;
//   [key: string]: any|unknown; // Remove this once you define specific properties
// }

// interface ApiResponse {
//   data?: MaintainerData[];
//   message?: string;
//   success?: boolean;
// }

// export async function GET(request: NextRequest): Promise<NextResponse> {
//   const controller = new AbortController();

//   try {
//     const token: string | null = await getAuthToken(request);

//     if (!token) {
//       return NextResponse.json(
//         { message: "Unauthorized: Token missing" } as ErrorResponse,
//         { status: 401 }
//       );
//     }

//     const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     if (!apiUrl) {
//       return NextResponse.json(
//         { message: "API base URL not configured" } as ErrorResponse,
//         { status: 500 }
//       );
//     }

//     const response: Response = await fetch(
//       `${apiUrl}/v1/user/getAllMaintainer`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         signal: controller.signal,
//       }
//     );

//     if (!response.ok) {
//       const errorData: ErrorResponse = await response.json();
//       return NextResponse.json(
//         {
//           message: errorData?.message || "Failed to fetch maintainers",
//         } as ErrorResponse,
//         { status: response.status }
//       );
//     }

//     const data: ApiResponse = await response.json();

//     // Create a NextResponse object
//     const nextResponse: NextResponse = NextResponse.json(data);

//     // Forward cookies from the backend response
//     const setCookieHeader: string | null = response.headers.get("set-cookie");
//     if (setCookieHeader) {
//       nextResponse.headers.set("set-cookie", setCookieHeader);
//     }

//     return nextResponse;
//   } catch (error: unknown) {
//     console.error("Get Maintainers error:", error);

//     const errorMessage =
//       error instanceof Error ? error.message : "Internal Server Error";

//     return NextResponse.json({ message: errorMessage } as ErrorResponse, {
//       status: 500,
//     });
//   } finally {
//     // Clean up the abort controller
//     controller.abort();
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

interface ErrorResponse {
  message: string;
}

interface ApiResponse {
  [key: string]: any;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  let controller: AbortController | null = null;

  try {
    const token: string | null = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" } as ErrorResponse,
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API base URL not configured" } as ErrorResponse,
        { status: 500 }
      );
    }

    // Create AbortController with timeout
    controller = new AbortController();

    console.log("Fetching maintainers from:", `${apiUrl}/v1/user/getAllMaintainer`);

    const response: Response = await fetch(
      `${apiUrl}/v1/user/getAllMaintainer`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        signal: controller.signal,
      }
    );

    // Clear the timeout since request completed

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error("Backend API error:", errorData);
      return NextResponse.json(
        {
          message: errorData?.message || "Failed to fetch maintainers",
        } as ErrorResponse,
        { status: response.status }
      );
    }

    const data: ApiResponse = await response.json();
    console.log("Successfully fetched maintainers data");

    // Create a NextResponse object
    const nextResponse: NextResponse = NextResponse.json(data);

    // Forward cookies from the backend response
    const setCookieHeader: string | null = response.headers.get("set-cookie");
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error: unknown) {
    console.error("Get Maintainers error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { message: "Request timeout - please try again" } as ErrorResponse,
          { status: 504 }
        );
      }
      
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { message: "Unable to connect to backend service" } as ErrorResponse,
          { status: 503 }
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json({ message: errorMessage } as ErrorResponse, {
      status: 500,
    });
  } finally {
    // Clean up the abort controller only if it exists
    if (controller) {
      controller.abort();
    }
  }
}
