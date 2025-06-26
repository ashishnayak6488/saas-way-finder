// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const floorId = searchParams.get('floor_id');
//     const sharedId = searchParams.get('shared_id');
//     const buildingId = searchParams.get('building_id');
    
//     let apiUrl: string;
    
   
//     apiUrl = `${API_BASE_URL}/v1/verticalConnector/shared/${sharedId}`;
    
//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//     });

//     const responseText = await response.text();

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//       } catch (e) {
//         console.error('Could not parse error response:', responseText);
//       }
      
//       return NextResponse.json(
//         { error: errorData?.detail || 'Failed to fetch vertical connectors', details: errorData },
//         { status: response.status }
//       );
//     }

//     const data = JSON.parse(responseText);
    
//     // Transform response for floor-specific queries
//     if (data.data && data.data.connectors) {
//       return NextResponse.json({
//         ...data,
//         data: data.data.connectors
//       });
//     }
    
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
    const sharedId = searchParams.get('shared_id');
    const buildingId = searchParams.get('building_id');
    const isPublished = searchParams.get('is_published');
    const includeInactive = searchParams.get('include_inactive') || 'false';
    
    if (!sharedId) {
      return NextResponse.json(
        { error: 'shared_id parameter is required' },
        { status: 400 }
      );
    }

    // Build the API URL - note the path structure matches your FastAPI endpoint
    let apiUrl = `${API_BASE_URL}/v1/verticalConnector/sharedId/${encodeURIComponent(sharedId)}`;
    
    // Add query parameters
    const queryParams = new URLSearchParams();
    if (buildingId) queryParams.append('building_id', buildingId);
    if (isPublished !== null) queryParams.append('is_published', isPublished);
    queryParams.append('include_inactive', includeInactive);
    
    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`;
    }

    console.log('Fetching connectors from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
      }
      
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to fetch vertical connectors', details: errorData },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    
    // Transform response to match expected format
    // Your FastAPI returns: { status, message, data: { shared_id, connector_type, total_floors, connectors, floor_ids } }
    // Frontend expects: array of connectors
    if (data.data && data.data.connectors) {
      return NextResponse.json({
        status: data.status,
        message: data.message,
        data: data.data.connectors, // Return the connectors array
        metadata: {
          shared_id: data.data.shared_id,
          connector_type: data.data.connector_type,
          total_floors: data.data.total_floors,
          floor_ids: data.data.floor_ids
        }
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching vertical connectors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
