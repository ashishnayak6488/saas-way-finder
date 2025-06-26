// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { buildingId: string } }
// ) {
//   try {
//     const { buildingId } = params;
//     const { searchParams } = new URL(request.url);
    
//     // Get query parameters
//     const floorId = searchParams.get('floor_id');
//     const category = searchParams.get('category');
//     const isPublished = searchParams.get('is_published');
//     const includeInactive = searchParams.get('include_inactive') || 'false';
    
//     // Build query string for backend API
//     const backendParams = new URLSearchParams();
//     if (floorId) backendParams.append('floor_id', floorId);
//     if (category) backendParams.append('category', category);
//     if (isPublished) backendParams.append('is_published', isPublished);
//     backendParams.append('include_inactive', includeInactive);
    
//     const backendUrl = `${API_BASE_URL}/v1/location/building/${buildingId}?${backendParams.toString()}`;
    
//     console.log('Fetching building locations from:', backendUrl);
    
//     const response = await fetch(backendUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         // Add any authentication headers if needed
//         // 'Authorization': `Bearer ${token}`,
//       },
//     });
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Backend API error:', response.status, errorText);
      
//       let errorData;
//       try {
//         errorData = JSON.parse(errorText);
//       } catch (e) {
//         errorData = { error: errorText };
//       }
      
//       return NextResponse.json(
//         { 
//           error: errorData.detail || errorData.error || 'Failed to fetch building locations',
//           status: 'error'
//         },
//         { status: response.status }
//       );
//     }
    
//     const data = await response.json();
    
//     console.log('Successfully fetched building locations:', {
//       buildingId,
//       totalFloors: data.data?.total_floors || 0,
//       totalLocations: data.data?.total_locations || 0
//     });
    
//     return NextResponse.json(data);
    
//   } catch (error) {
//     console.error('Error in building locations API route:', error);
//     return NextResponse.json(
//       { 
//         error: 'Internal server error while fetching building locations',
//         status: 'error'
//       },
//       { status: 500 }
//     );
//   }
// }

// // Optional: Add other HTTP methods if needed
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { buildingId: string } }
// ) {
//   return NextResponse.json(
//     { error: 'Method not allowed' },
//     { status: 405 }
//   );
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { buildingId: string } }
// ) {
//   return NextResponse.json(
//     { error: 'Method not allowed' },
//     { status: 405 }
//   );
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { buildingId: string } }
// ) {
//   return NextResponse.json(
//     { error: 'Method not allowed' },
//     { status: 405 }
//   );
// }



import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get building_id from query parameters
    const buildingId = searchParams.get('building_id');
    
    if (!buildingId) {
      return NextResponse.json(
        { error: 'Building ID is required', status: 'error' },
        { status: 400 }
      );
    }
    
    // Get other query parameters
    const floorId = searchParams.get('floor_id');
    const category = searchParams.get('category');
    const isPublished = searchParams.get('is_published');
    const includeInactive = searchParams.get('include_inactive') || 'false';
    
    // Build query string for backend API
    const backendParams = new URLSearchParams();
    if (floorId) backendParams.append('floor_id', floorId);
    if (category) backendParams.append('category', category);
    if (isPublished) backendParams.append('is_published', isPublished);
    backendParams.append('include_inactive', includeInactive);
    
    const backendUrl = `${API_BASE_URL}/v1/location/building/${buildingId}?${backendParams.toString()}`;
    
    console.log('Fetching building locations from:', backendUrl);
    console.log('Building ID:', buildingId);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      
      return NextResponse.json(
        { 
          error: errorData.detail || errorData.error || 'Failed to fetch building locations',
          status: 'error'
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    console.log('Successfully fetched building locations:', {
      buildingId,
      totalFloors: data.data?.total_floors || 0,
      totalLocations: data.data?.total_locations || 0
    });
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in building locations API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching building locations',
        status: 'error'
      },
      { status: 500 }
    );
  }
}
