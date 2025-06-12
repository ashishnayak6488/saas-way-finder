// import { NextRequest, NextResponse } from "next/server";
// import { getAuthToken } from "@/middleware";

// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { floor_id, building_id, label, order, imageUrl } = body;

//     if (!floor_id || !building_id) {
//       return NextResponse.json(
//         { message: "Floor ID and Building ID are required" },
//         { status: 400 }
//       );
//     }

//     const token = await getAuthToken(req);
//     if (!token) {
//       return NextResponse.json(
//         { message: "Unauthorized: Token missing" },
//         { status: 401 }
//       );
//     }

//     // Create FormData for backend
//     const backendFormData = new FormData();
//     if (label) backendFormData.append('name', label);
//     if (order !== undefined) backendFormData.append('floor_number', order.toString());
//     backendFormData.append('building_id', building_id);

//     // Handle image if provided
//     if (imageUrl && imageUrl.startsWith('data:')) {
//       try {
//         const response = await fetch(imageUrl);
//         const blob = await response.blob();
//         backendFormData.append('floor_plan', blob, 'floor_plan.png');
//       } catch (error) {
//         console.error("Error converting image:", error);
//       }
//     }

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/${floor_id}`,
//       {
//         method: "PUT",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: backendFormData,
//         credentials: "include",
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { message: data.message || data.detail || "Failed to update floor" },
//         { status: response.status }
//       );
//     }

//     // Transform response
//     const transformedData = {
//       floor_id: data.data.floor_id,
//       label: data.data.name,
//       order: data.data.floor_number,
//       imageUrl: data.data.floor_plan_url,
//       building_id: data.data.building_id,
//       datetime: data.data.datetime,
//       status: data.data.status,
//     };

//     return NextResponse.json({
//       ...data,
//       data: transformedData
//     });
//   } catch (error) {
//     console.error("Update floor error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { floor_id, building_id, label, order, imageUrl, status = "active", description } = body;

    if (!floor_id || !building_id) {
      return NextResponse.json(
        { message: "Floor ID and Building ID are required" },
        { status: 400 }
      );
    }

    // Validate required fields based on backend requirements
    if (!label || order === undefined) {
      return NextResponse.json(
        { message: "Floor name (label) and floor number (order) are required" },
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

    // Prepare data in the format expected by backend
    const backendData = {
      name: label, // Map label to name
      building_id: building_id,
      floor_number: order, // Map order to floor_number
      floor_plan_url: imageUrl || null, // Map imageUrl to floor_plan_url
      locations: [], // Default empty array as per backend model
      status: status,
      description: description || null
    };

    console.log("Sending data to backend:", backendData);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/floor/${floor_id}`,
      {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json", // Changed to JSON
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(backendData), // Send as JSON
        credentials: "include",
      }
    );

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      return NextResponse.json(
        { message: "Invalid response from server", details: responseText },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        { 
          message: data.message || data.detail || "Failed to update floor",
          details: data 
        },
        { status: response.status }
      );
    }

    // Transform response back to frontend format
    const transformedData = {
      floor_id: data.data.floor_id,
      label: data.data.name, // Map name back to label
      order: data.data.floor_number, // Map floor_number back to order
      imageUrl: data.data.floor_plan_url, // Map floor_plan_url back to imageUrl
      building_id: data.data.building_id,
      datetime: data.data.datetime,
      status: data.data.status,
      description: data.data.description,
      updated_by: data.data.updated_by,
      update_on: data.data.update_on,
    };

    return NextResponse.json({
      ...data,
      data: transformedData
    });
  } catch (error) {
    console.error("Update floor error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


