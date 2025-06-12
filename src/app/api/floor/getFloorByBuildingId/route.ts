
// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken } from "@/middleware";
// import { cookies } from "next/headers";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { buildingId: string } }
// ) {
//   try {
//     const { buildingId } = params;

//     if (!buildingId) {
//       return NextResponse.json(
//         { message: "Building ID is required" },
//         { status: 400 }
//       );
//     }

//     console.log("Building ID:", buildingId);

//     // Extract query parameters
//     const { searchParams } = new URL(req.url);
//     const statusFilter = searchParams.get('status_filter') || 'active';
//     const includeLocationsCount = searchParams.get('include_locations_count') || 'true';
//     const limit = searchParams.get('limit');
//     const skip = searchParams.get('skip') || '0';

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

//     if (!token) {
//       return NextResponse.json(
//         { message: "Unauthorized: Token missing" },
//         { status: 401 }
//       );
//     }

//     // Build query parameters for backend
//     const queryParams = new URLSearchParams({
//       status_filter: statusFilter,
//       include_locations_count: includeLocationsCount,
//       skip: skip,
//     });

//     if (limit) {
//       queryParams.append('limit', limit);
//     }

//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 30000);

//     console.log(`Fetching floors for building: ${buildingId}`);

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/building/${buildingId}?${queryParams.toString()}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//           Cookie: `${process.env.SESSION_COOKIE_NAME || "digital-signage"}=${token}`,
//         },
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
//           message: data.message || data.detail || "Failed to fetch floors",
//           error: data,
//         },
//         { status: response.status }
//       );
//     }

//     // Transform backend response to match frontend expectations
//     if (data.data && data.data.floors) {
//       const transformedFloors = data.data.floors.map((floor: any) => ({
//         floor_id: floor.floor_id,
//         label: floor.name, // Map name to label for frontend
//         order: floor.floor_number, // Map floor_number to order for frontend
//         imageUrl: floor.floor_plan_url, // Map floor_plan_url to imageUrl for frontend
//         building_id: floor.building_id,
//         datetime: floor.datetime,
//         status: floor.status,
//         description: floor.description,
//         locations_count: floor.locations_count || 0,
//         created_by: floor.created_by,
//         updated_by: floor.updated_by,
//         update_on: floor.update_on,
//       }));

//       // Transform the main response
//       const transformedData = {
//         building_id: data.data.building_id,
//         building_name: data.data.building_name,
//         total_floors: data.data.total_floors,
//         floors: transformedFloors,
//       };

//       return NextResponse.json({
//         ...data,
//         data: transformedData
//       }, { status: 200 });
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
    // Get buildingId from query parameters instead of route params
    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get('buildingId');

    if (!buildingId) {
      return NextResponse.json(
        { message: "Building ID is required as query parameter" },
        { status: 400 }
      );
    }

    console.log("Building ID:", buildingId);

    // Extract other query parameters
    const statusFilter = searchParams.get('status_filter') || 'active';
    const includeLocationsCount = searchParams.get('include_locations_count') || 'true';
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip') || '0';

    let token = null;
    try {
      token = await getAuthToken(req);
    } catch (error) {
      console.error("Error getting auth token:", error);
    }

    if (!token) {
      const cookieStore = await cookies();
      const cookieName = process.env.SESSION_COOKIE_NAME || "digital-signage";
      token = cookieStore.get(cookieName)?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    // Build query parameters for backend
    const queryParams = new URLSearchParams({
      status_filter: statusFilter,
      include_locations_count: includeLocationsCount,
      skip: skip,
    });

    if (limit) {
      queryParams.append('limit', limit);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    console.log(`Fetching floors for building: ${buildingId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/building/${buildingId}?${queryParams.toString()}`,
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
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      data = { message: responseText || "Invalid response from server" };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || data.detail || "Failed to fetch floors",
          error: data,
        },
        { status: response.status }
      );
    }

    // Transform backend response to match frontend expectations
    if (data.data && data.data.floors) {
      const transformedFloors = data.data.floors.map((floor: any) => ({
        floor_id: floor.floor_id,
        label: floor.name, // Map name to label for frontend
        order: floor.floor_number, // Map floor_number to order for frontend
        imageUrl: floor.floor_plan_url, // Map floor_plan_url to imageUrl for frontend
        building_id: floor.building_id,
        datetime: floor.datetime,
        status: floor.status,
        description: floor.description,
        locations_count: floor.locations_count || 0,
        created_by: floor.created_by,
        updated_by: floor.updated_by,
        update_on: floor.update_on,
      }));

      // Transform the main response
      const transformedData = {
        building_id: data.data.building_id,
        building_name: data.data.building_name,
        total_floors: data.data.total_floors,
        floors: transformedFloors,
      };

      return NextResponse.json({
        ...data,
        data: transformedData
      }, { status: 200 });
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
