// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken } from "@/middleware";
// import { cookies } from "next/headers";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
    
//     console.log("Received floor creation payload");

//     // Extract form data
//     const name = formData.get('name') as string;
//     const building_id = formData.get('building_id') as string;
//     const floor_number = formData.get('floor_number') as string;
//     const description = formData.get('description') as string;
//     const is_published = formData.get('is_published') as string;
//     const floor_plan = formData.get('floor_plan') as File;

//     if (!name || !building_id || !floor_number) {
//       return NextResponse.json(
//         { message: "Name, building_id, and floor_number are required" },
//         { status: 400 }
//       );
//     }

//     // Create FormData for backend
//     const backendFormData = new FormData();
//     backendFormData.append('name', name);
//     backendFormData.append('building_id', building_id);
//     backendFormData.append('floor_number', floor_number);
    
//     if (description) {
//       backendFormData.append('description', description);
//     }
    
//     backendFormData.append('is_published', is_published || 'true');
    
//     if (floor_plan && floor_plan.size > 0) {
//       backendFormData.append('floor_plan', floor_plan);
//     }

//     let token = null;
//     try {
//       token = await getAuthToken(req);
//       console.log("Token from getAuthToken:", token ? "Found" : "Not found");
//     } catch (error) {
//       console.error("Error getting auth token:", error);
//     }

//     if (!token) {
//       const cookieStore = cookies();
//       const cookieName = process.env.SESSION_COOKIE_NAME || "digital-signage";
//       token = (await cookieStore).get(cookieName)?.value;
//       console.log("Token from cookies fallback:", token ? "Found" : "Not found");
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased timeout for file upload

//     console.log("Making request to backend with token");

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//           Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
//         },
//         body: backendFormData,
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

//     console.log("Response status:", response.status);
//     console.log("Response data:", data);

//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           message: data.message || data.detail || "Failed to create floor",
//           error: data,
//         },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: 201 });
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

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body instead of form data since frontend sends JSON
    const body = await req.json();
    
    console.log("Received floor creation payload:", body);

    // Extract data from JSON body
    const { building_id, label, order, imageUrl } = body;

    if (!label || !building_id || order === undefined) {
      return NextResponse.json(
        { message: "Label, building_id, and order are required" },
        { status: 400 }
      );
    }

    // Get auth token
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

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    // Create FormData for backend (since your FastAPI expects form data)
    const backendFormData = new FormData();
    backendFormData.append('name', label); // Map label to name
    backendFormData.append('building_id', building_id);
    backendFormData.append('floor_number', order.toString()); // Map order to floor_number
    backendFormData.append('description', ''); // Optional description
    backendFormData.append('is_published', 'true');

    // Handle image if provided
    if (imageUrl && imageUrl.startsWith('data:')) {
      try {
        // Convert base64 to blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        backendFormData.append('floor_plan', blob, 'floor_plan.png');
      } catch (error) {
        console.error("Error converting image:", error);
        // Continue without image
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100000);

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
    } catch (error:unknown) {
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

    // Transform backend response to match frontend expectations
    const transformedData = {
      floor_id: data.data.floor_id,
      label: data.data.name, // Map name back to label
      order: data.data.floor_number, // Map floor_number back to order
      imageUrl: data.data.floor_plan_url || data.data.imageUrl, // Use floor_plan_url
      building_id: data.data.building_id,
      datetime: data.data.datetime,
      status: data.data.status,
    };

    return NextResponse.json({
      ...data,
      data: transformedData
    }, { status: 201 });
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
