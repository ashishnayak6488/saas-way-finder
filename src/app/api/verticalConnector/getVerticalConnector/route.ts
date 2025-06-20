// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const floorId = searchParams.get('floor_id');
//     const sharedId = searchParams.get('shared_id');
//     const buildingId = searchParams.get('building_id');
//     const connectorType = searchParams.get('connector_type');
//     const search = searchParams.get('search');
//     const isPublished = searchParams.get('is_published');
    
//     console.log('Vertical Connector API GET called with params:', {
//       floorId,
//       sharedId,
//       buildingId,
//       connectorType,
//       search,
//       isPublished
//     });
    
//     // Build query parameters for FastAPI
//     const apiParams = new URLSearchParams();
//     if (floorId) apiParams.append('floor_id', floorId);
//     if (sharedId) apiParams.append('shared_id', sharedId);
//     if (buildingId) apiParams.append('building_id', buildingId);
//     if (connectorType) apiParams.append('connector_type', connectorType);
//     if (search) apiParams.append('search', search);
//     if (isPublished) apiParams.append('is_published', isPublished);
    
//     const apiUrl = `${API_BASE_URL}/v1/verticalConnector/floor?${apiParams.toString()}`;
//     console.log('Calling FastAPI at:', apiUrl);
    
//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//     });

//     console.log('FastAPI response status:', response.status);
    
//     const responseText = await response.text();
//     console.log('FastAPI response text:', responseText);

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//         console.error('Get error:', JSON.stringify(errorData, null, 2));
//       } catch (e) {
//         console.error('Could not parse error response:', responseText);
//       }
      
//       return NextResponse.json(
//         { error: errorData?.detail || 'Failed to fetch vertical connectors', details: errorData },
//         { status: response.status }
//       );
//     }

//     const data = JSON.parse(responseText);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching vertical connectors:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const floorId = searchParams.get('floor_id');
    const sharedId = searchParams.get('shared_id');
    const buildingId = searchParams.get('building_id');
    const connectorType = searchParams.get('connector_type');
    const search = searchParams.get('search');
    const isPublished = searchParams.get('is_published');
    
    console.log('Vertical Connector API GET called with params:', {
      floorId,
      sharedId,
      buildingId,
      connectorType,
      search,
      isPublished
    });
    
    let apiUrl: string;
    
    // If floor_id is provided, use the specific floor endpoint
    if (floorId) {
      apiUrl = `${API_BASE_URL}/v1/verticalConnector/floor/${floorId}`;
    } else {
      // For other queries, build query parameters for general endpoint
      const apiParams = new URLSearchParams();
      if (sharedId) apiParams.append('shared_id', sharedId);
      if (buildingId) apiParams.append('building_id', buildingId);
      if (connectorType) apiParams.append('connector_type', connectorType);
      if (search) apiParams.append('search', search);
      if (isPublished) apiParams.append('is_published', isPublished);
      
      // Use general endpoint for other queries (you'll need to implement this in FastAPI)
      apiUrl = `${API_BASE_URL}/v1/verticalConnector?${apiParams.toString()}`;
    }
    
    console.log('Calling FastAPI at:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    console.log('FastAPI response status:', response.status);
    
    const responseText = await response.text();
    console.log('FastAPI response text:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Get error:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('Could not parse error response:', responseText);
      }
      
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to fetch vertical connectors', details: errorData },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    
    // Transform the response to match frontend expectations
    let transformedData;
    if (data.data && data.data.connectors) {
      // For floor-specific endpoint response
      transformedData = {
        status: data.status,
        message: data.message,
        data: data.data.connectors // Extract just the connectors array
      };
    } else {
      // For general endpoint response (when you implement it)
      transformedData = data;
    }
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching vertical connectors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
