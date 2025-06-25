// // import { NextResponse, NextRequest } from 'next/server';

// // // Define the expected request body type
// // interface DeleteRequestBody {
// //   user_uuid: string;
// // }

// // // Define the auth token type
// // interface AuthToken {
// //   access_token: string;
// // }

// // // Define the API response type
// // interface ApiResponse {
// //   success?: boolean;
// //   detail?: string;
// // }

// // // Define a custom error type for better error handling
// // class ApiError extends Error {
// //   constructor(
// //     public message: string,
// //     public status: number
// //   ) {
// //     super(message);
// //     this.name = 'ApiError';
// //   }
// // }

// // // Assume getAuthToken returns a Promise<AuthToken | null>
// // declare function getAuthToken(): Promise<AuthToken | null>;

// // export async function DELETE(request: NextRequest) {
// //   try {
// //     // Validate request body
// //     let body: DeleteRequestBody;
// //     try {
// //       body = await request.json();
// //     } catch {
// //       return NextResponse.json(
// //         { message: 'Invalid request body' },
// //         { status: 400 }
// //       );
// //     }

// //     const { user_uuid } = body;
// //     if (!user_uuid) {
// //       return NextResponse.json(
// //         { message: 'Missing or invalid user UUID' },
// //         { status: 400 }
// //       );
// //     }

// //     // Get auth token
// //     const token = await getAuthToken();
// //     if (!token || !token.access_token) {
// //       return NextResponse.json(
// //         { message: 'Unauthorized: Token missing or invalid' },
// //         { status: 401 }
// //       );
// //     }

// //     // Configure AbortController with timeout
// //     const controller = new AbortController();
// //     const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

// //     // Make API request
// //     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
// //     if (!apiBaseUrl) {
// //       throw new ApiError('Server configuration error: API base URL missing', 500);
// //     }

// //     const response = await fetch(
// //       `${apiBaseUrl}/v1/user/delete?user_uuid=${encodeURIComponent(user_uuid)}`,
// //       {
// //         method: 'DELETE',
// //         headers: {
// //           Accept: 'application/json',
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token.access_token}`,
// //         },
// //         credentials: 'include',
// //         signal: controller.signal,
// //       }
// //     );

// //     // Clear timeout on response
// //     clearTimeout(timeoutId);

// //     const data: ApiResponse = await response.json();

// //     if (!response.ok) {
// //       return NextResponse.json(
// //         { message: data.detail || 'Failed to delete user' },
// //         { status: response.status }
// //       );
// //     }

// //     return NextResponse.json(data, { status: 200 });
// //   } catch (error: unknown) {
// //     // Log error for debugging
// //     console.error('DELETE /api/user error:', error);

// //     if (error instanceof ApiError) {
// //       return NextResponse.json(
// //         { message: error.message },
// //         { status: error.status }
// //       );
// //     }

// //     if (error instanceof Error && error.name === 'AbortError') {
// //       return NextResponse.json(
// //         { message: 'Request timed out' },
// //         { status: 504 }
// //       );
// //     }

// //     return NextResponse.json(
// //       { message: 'Internal Server Error' },
// //       { status: 500 }
// //     );
// //   }
// // }



// import { NextResponse, NextRequest } from 'next/server';
// import { getAuthToken } from '@/middleware'; // Add this import

// interface DeleteRequestBody {
//   user_uuid: string;
// }

// interface AuthToken {
//   access_token: string;
// }

// interface ApiResponse {
//   success?: boolean;
//   detail?: string;
// }

// class ApiError extends Error {
//   constructor(
//     public message: string,
//     public status: number
//   ) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// export async function DELETE(request: NextRequest): Promise<NextResponse> {
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

//     const { user_uuid } = body;
//     if (!user_uuid) {
//       return NextResponse.json(
//         { message: 'Missing or invalid user UUID' },
//         { status: 400 }
//       );
//     }

//     // Get auth token
//     const token = await getAuthToken(request);
//     if (!token || !token) {
//       return NextResponse.json(
//         { message: 'Unauthorized: Token missing or invalid' },
//         { status: 401 }
//       );
//     }

//     // Configure AbortController with timeout
//     const controller = new AbortController();

//     try {
//       // Make API request
//       const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//       if (!apiBaseUrl) {
//         throw new ApiError('Server configuration error: API base URL missing', 500);
//       }

//       const response = await fetch(
//         `${apiBaseUrl}/v1/user/delete?user_uuid=${encodeURIComponent(user_uuid)}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: 'include',
//           signal: controller.signal,
//         }
//       );

//       const data: ApiResponse = await response.json();

//       if (!response.ok) {
//         return NextResponse.json(
//           { message: data.detail || 'Failed to delete user' },
//           { status: response.status }
//         );
//       }

//       return NextResponse.json(data, { status: 200 });
//     } finally {
//       controller.abort();
//     }
//   } catch (error: unknown) {
//     console.error('DELETE /api/user error:', error);

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
import { getAuthToken } from '@/middleware';

interface DeleteRequestBody {
  user_uuid: string;
}

interface AuthToken {
  access_token: string;
}

interface ApiResponse {
  success?: boolean;
  detail?: string;
  message?: string;
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

export async function DELETE(request: NextRequest) {
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

    const { user_uuid } = body;
    if (!user_uuid) {
      return NextResponse.json(
        { message: 'Missing or invalid user UUID' },
        { status: 400 }
      );
    }

    console.log('Deleting user with UUID:', user_uuid);

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
      // Make API request - ✅ Fixed: Use query parameter instead of body
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new ApiError('Server configuration error: API base URL missing', 500);
      }

      // ✅ Changed: Pass user_uuid as _id query parameter to match backend expectation
      const response = await fetch(
        `${apiBaseUrl}/v1/user/delete?_id=${encodeURIComponent(user_uuid)}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          signal: controller.signal,
          // ✅ Removed body since backend expects query parameter
        }
      );

      let data: ApiResponse;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response as JSON");
        data = { message: "Invalid response from server" };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.detail || 'Failed to delete user';
        console.error('Delete user error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        return NextResponse.json(
          { message: errorMessage },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } finally {
      controller.abort(); // Ensure we abort the request if it takes too long
    }
  } catch (error: unknown) {
    console.error('DELETE /api/organization/deleteUsers error:', error);

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
