import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/middleware";

interface ErrorResponse {
  message: string;
  error?: any|unknown;
}

interface UpdateOrganizationRequest {
  id: string;
  entity_type?: string;
  name?: string;
  description?: string;
  headcount?: number | string;
  domain?: string;
  parent_uuid?: string;
  address_id?: number | string;
}

interface UpdateOrganizationData {
  entity_type?: string;
  name?: string;
  description?: string;
  headcount?: number;
  domain?: string;
  parent_uuid?: string;
  address_id?: number;
}

interface ApiResponse {
  data?: any|unknown;
  message?: string;
  success?: boolean;
  detail?: string;
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const controller = new AbortController();
  
  try {
    const updateData: UpdateOrganizationRequest = await request.json();
    const entity_uuid: string = updateData.id; // Extract entity_uuid from body

    if (!entity_uuid) {
      return NextResponse.json(
        { message: "Entity UUID (id) is required in the request body" } as ErrorResponse,
        { status: 400 }
      );
    }

    // Remove id from the data sent to FastAPI
    const { ...dataWithoutId } = updateData;

    // Prepare data according to the backend model (all fields are optional)
    const dataToSend: UpdateOrganizationData = {
      entity_type: dataWithoutId.entity_type || undefined,
      name: dataWithoutId.name || undefined,
      description: dataWithoutId.description || undefined,
      headcount: typeof dataWithoutId.headcount === 'number' ? dataWithoutId.headcount :
        (dataWithoutId.headcount ? parseInt(dataWithoutId.headcount as string) : undefined),
      domain: dataWithoutId.domain || undefined,
      parent_uuid: dataWithoutId.parent_uuid || undefined,
      address_id: typeof dataWithoutId.address_id === 'number' ? dataWithoutId.address_id :
        (dataWithoutId.address_id ? parseInt(dataWithoutId.address_id as string) : undefined),
    };

    // Remove undefined values to avoid sending them to the backend
    Object.keys(dataToSend).forEach((key) => {
      if (dataToSend[key as keyof UpdateOrganizationData] === undefined) {
        delete dataToSend[key as keyof UpdateOrganizationData];
      }
    });

    console.log("Data to send to backend:", JSON.stringify(dataToSend, null, 2));

    const token: string | null = await getAuthToken(request);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Token missing" } as ErrorResponse,
        { status: 401 }
      );
    }

    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { message: "API base URL not configured" } as ErrorResponse,
        { status: 500 }
      );
    }

    // Use the correct URL format as specified
    const requestUrl = `${apiUrl}/v1/organization/update?entity_uuid=${entity_uuid}`;
    console.log("Making request to:", requestUrl);

    const response: Response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Try to get the response as text first
    const responseText: string = await response.text();
    let data: ApiResponse;

    try {
      // Then parse it as JSON if possible
      data = JSON.parse(responseText);
      console.log("Response data from route:", data);
    } catch (error:unknown) {
      console.error("Failed to parse response as JSON:", responseText);
      data = { message: responseText || "Invalid response from server" };
    }

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || data.detail || "Failed to update organization",
          error: data
        } as ErrorResponse,
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in updateOrganization API:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { message: errorMessage } as ErrorResponse,
      { status: 500 }
    );
  } finally {
    // Clean up the abort controller
    controller.abort();
  }
}
