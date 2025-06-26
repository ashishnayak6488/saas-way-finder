// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { buildingId: string } }
// ) {
//   try {
//     const { buildingId } = params;
//     const { searchParams } = new URL(request.url);
    
//     if (!buildingId) {
//       return NextResponse.json(
//         { error: 'Building ID is required' },
//         { status: 400 }
//       );
//     }
    
//     // Get query parameters
//     const isPublished = searchParams.get('is_published');
//     const pathType = searchParams.get('path_type'); // 'single', 'multi', or undefined for all
//     const statusFilter = searchParams.get('status_filter') || 'active';
//     const limit = searchParams.get('limit');
//     const skip = searchParams.get('skip');
//     const includeStats = searchParams.get('include_stats') || 'true';
    
//     // Build query string for FastAPI
//     const queryParams = new URLSearchParams();
//     if (isPublished !== null) {
//       queryParams.append('is_published', isPublished);
//     }
//     if (pathType) {
//       queryParams.append('path_type', pathType);
//     }
//     queryParams.append('status_filter', statusFilter);
//     if (limit) {
//       queryParams.append('limit', limit);
//     }
//     if (skip) {
//       queryParams.append('skip', skip);
//     }
//     queryParams.append('include_stats', includeStats);
    
//     const queryString = queryParams.toString();
//     const url = `${API_BASE_URL}/v1/path/building/${buildingId}${queryString ? `?${queryString}` : ''}`;
    
//     console.log('Fetching building paths from:', url);
    
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//     });

//     const responseText = await response.text();
//     console.log('Backend response:', responseText);

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//       } catch (e) {
//         console.error('Could not parse error response:', responseText);
//         return NextResponse.json(
//           { error: 'Failed to fetch building paths - invalid response from server' },
//           { status: response.status }
//         );
//       }
      
//       return NextResponse.json(
//         { error: errorData.detail || errorData.message || 'Failed to fetch building paths' },
//         { status: response.status }
//       );
//     }

//     const data = JSON.parse(responseText);
//     return NextResponse.json({
//       success: true,
//       data: data
//     });
//   } catch (error) {
//     console.error('Error fetching building paths:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { buildingId: string } }
) {
  try {
    const { buildingId } = params;
    const { searchParams } = new URL(request.url);
    
    if (!buildingId) {
      return NextResponse.json(
        { error: 'Building ID is required' },
        { status: 400 }
      );
    }
    
    // Get query parameters
    const isPublished = searchParams.get('is_published');
    const pathType = searchParams.get('path_type'); // 'single', 'multi', or undefined for all
    const limit = searchParams.get('limit') || '100'; // Default limit
    const skip = searchParams.get('skip') || '0'; // Default skip
    
    // Build query string for FastAPI
    const queryParams = new URLSearchParams();
    if (isPublished !== null && isPublished !== undefined) {
      queryParams.append('is_published', isPublished);
    }
    if (pathType) {
      queryParams.append('path_type', pathType);
    }
    queryParams.append('limit', limit);
    queryParams.append('skip', skip);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/v1/path/building/${buildingId}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching building paths from FastAPI:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const responseText = await response.text();
    console.log('FastAPI response status:', response.status);
    console.log('FastAPI response text:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
        return NextResponse.json(
          { error: 'Failed to fetch building paths - invalid response from server' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to fetch building paths' },
        { status: response.status }
      );
    }

    // Parse the response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Could not parse successful response:', responseText);
      return NextResponse.json(
        { error: 'Invalid JSON response from server' },
        { status: 500 }
      );
    }

    // Return the data as-is since FastAPI already formats it correctly
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching building paths:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
