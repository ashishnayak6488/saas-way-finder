// import { NextResponse, NextRequest } from 'next/server';

// // Define the expected request body type
// interface DeleteRequestBody {
//   _id: {
//     organization: string;
//   };
// }

// // Define the auth token type
// interface AuthToken {
//   access_token: string;
// }

// // Define the API response type
// interface ApiResponse {
//   success?: boolean;
//   detail?: string;
// }

// // Define a custom error type for better error handling
// class ApiError extends Error {
//   constructor(
//     public message: string,
//     public status: number
//   ) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// // Assume getAuthToken returns a Promise<AuthToken | null>
// declare function getAuthToken(): Promise<AuthToken | null>;

// export async function DELETE(request: NextRequest) {
//   try {
//     // Validate request body
//     let body: DeleteRequestBody;
//     try {
//       body = await request.json();
//     } catch {
//       return NextResponse.json(
//         { message: 'Invalid request body' },
//         { status: 400 }
//       );
//     }

//     const { _id } = body;
//     if (!_id?.organization) {
//       return NextResponse.json(
//         { message: 'Missing or invalid organization UUID' },
//         { status: 400 }
//       );
//     }



//     const entity_uuid = _id.organization;

//     console.log('Received entity_uuid:', entity_uuid);

//     // Get auth token
//     const token = await getAuthToken();
//     if (!token || !token.access_token) {
//       return NextResponse.json(
//         { message: 'Unauthorized: Token missing or invalid' },
//         { status: 401 }
//       );
//     }

//     // Configure AbortController with timeout
//     const controller = new AbortController();

//     // Make API request
//     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     if (!apiBaseUrl) {
//       throw new ApiError('Server configuration error: API base URL missing', 500);
//     }

//     const response = await fetch(
//       `${apiBaseUrl}/v1/organization/delete?entity_uuid=${encodeURIComponent(entity_uuid)}`,
//       {
//         method: 'DELETE',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token.access_token}`,
//         },
//         credentials: 'include',
//         signal: controller.signal,
//       }
//     );

//     const data: ApiResponse = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { message: data.detail || 'Failed to delete organization' },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (error: unknown) {
//     // Log error for debugging (use your preferred logging system)
//     console.error('DELETE /api/organization error:', error);

//     if (error instanceof ApiError) {
//       return NextResponse.json(
//         { message: error.message },
//         { status: error.status }
//       );
//     }

//     if (error instanceof Error && error.name === 'AbortError') {
//       return NextResponse.json(
//         { message: 'Request timed out' },
//         { status: 504 }
//       );
//     }

//     return NextResponse.json(
//       { message: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse, NextRequest } from 'next/server';
import { getAuthToken } from '@/middleware'; // Add this import

// Fix the interface to match what frontend sends
interface DeleteRequestBody {
  _id: string; // ✅ Changed from object to string
}

interface AuthToken {
  access_token: string;
}

interface ApiResponse {
  success?: boolean;
  detail?: string;
}

class ApiError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse>  {
  try {
    // Validate request body
    let body: DeleteRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { _id } = body;
    if (!_id) { // ✅ Simplified validation
      return NextResponse.json(
        { message: 'Missing or invalid organization UUID' },
        { status: 400 }
      );
    }

    const entity_uuid = _id; // ✅ Direct assignment

    console.log('Received entity_uuid:', entity_uuid);

    // Get auth token
    const token = await getAuthToken(request);
    if (!token || !token) {
      return NextResponse.json(
        { message: 'Unauthorized: Token missing or invalid' },
        { status: 401 }
      );
    }

    // Configure AbortController with timeout
    const controller = new AbortController();

    try {
      // Make API request
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new ApiError('Server configuration error: API base URL missing', 500);
      }

      const response = await fetch(
        `${apiBaseUrl}/v1/organization/delete?entity_uuid=${encodeURIComponent(entity_uuid)}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          signal: controller.signal,
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { message: data.detail || 'Failed to delete organization' },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } finally {
      controller.abort();
    }
  } catch (error: unknown) {
    console.error('DELETE /api/organization error:', error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { message: 'Request timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
