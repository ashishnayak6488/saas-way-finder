// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken } from "@/middleware";
// import { cookies } from "next/headers";

// export async function DELETE(req: NextRequest) {
//   try {
//     const { floor_id, building_id } = await req.json();

//     if (!floor_id) {
//       return NextResponse.json(
//         { message: "Floor ID is required" },
//         { status: 400 }
//       );
//     }

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
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/${floor_id}`,
//       {
//         method: "DELETE",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
//         },
//         body: JSON.stringify({ building_id }),
//         credentials: "include",
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
//           message: data.message || data.detail || "Failed to delete floor",
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

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { floor_id, building_id } = body;

    if (!floor_id || !building_id) {
      return NextResponse.json(
        { message: "Floor ID and Building ID are required" },
        { status: 400 }
      );
    }

    const token = await getAuthToken(req);
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/${floor_id}?building_id=${building_id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || data.detail || "Failed to delete floor" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete floor error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
