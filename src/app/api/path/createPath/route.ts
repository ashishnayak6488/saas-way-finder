// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';


// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     console.log('Creating path with body:', JSON.stringify(body, null, 2));
    
//     // Enhanced validation for multi-floor paths
//     if (body.is_multi_floor) {
//       if (!body.building_id) {
//         return NextResponse.json(
//           { error: 'Building ID is required for multi-floor paths' },
//           { status: 400 }
//         );
//       }
//       if (!body.floor_segments || body.floor_segments.length < 2) {
//         return NextResponse.json(
//           { error: 'Multi-floor paths must have at least 2 floor segments' },
//           { status: 400 }
//         );
//       }
//       if (!body.vertical_transitions || body.vertical_transitions.length !== body.floor_segments.length - 1) {
//         return NextResponse.json(
//           { error: 'Number of vertical transitions must be one less than floor segments' },
//           { status: 400 }
//         );
//       }
      
//       // Validate each floor segment has required points
//       for (let i = 0; i < body.floor_segments.length; i++) {
//         const segment = body.floor_segments[i];
//         if (!segment.points || segment.points.length < 2) {
//           return NextResponse.json(
//             { error: `Floor segment ${i + 1} must have at least 2 points` },
//             { status: 400 }
//           );
//         }
//       }
//     } else {
//       // Single floor validation
//       if (!body.floor_id) {
//         return NextResponse.json(
//           { error: 'Floor ID is required for single-floor paths' },
//           { status: 400 }
//         );
//       }
//       if (!body.points || body.points.length < 2) {
//         return NextResponse.json(
//           { error: 'Single-floor paths must have at least 2 points' },
//           { status: 400 }
//         );
//       }
//     }

//     // Set default values for required fields
//     const pathData = {
//       ...body,
//       shape: body.shape || 'circle',
//       radius: body.radius || 0.01,
//       color: body.color || '#3b82f6',
//       is_published: body.is_published ?? false,
//       created_by: body.created_by || 'user',
//     };
    
//     const response = await fetch(`${API_BASE_URL}/v1/path`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//       body: JSON.stringify(pathData),
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
//           { error: 'Failed to create path - invalid response from server' },
//           { status: response.status }
//         );
//       }
      
//       return NextResponse.json(
//         { error: errorData.detail || 'Failed to create path' },
//         { status: response.status }
//       );
//     }

//     const data = JSON.parse(responseText);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error creating path:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Creating path with body:', JSON.stringify(body, null, 2));
    
    // Enhanced validation for multi-floor paths
    if (body.is_multi_floor) {
      if (!body.building_id) {
        return NextResponse.json(
          { error: 'Building ID is required for multi-floor paths' },
          { status: 400 }
        );
      }
      if (!body.floor_segments || body.floor_segments.length < 2) {
        return NextResponse.json(
          { error: 'Multi-floor paths must have at least 2 floor segments' },
          { status: 400 }
        );
      }
      if (!body.vertical_transitions || body.vertical_transitions.length !== body.floor_segments.length - 1) {
        return NextResponse.json(
          { error: 'Number of vertical transitions must be one less than floor segments' },
          { status: 400 }
        );
      }
      
      // Validate each floor segment has required points
      for (let i = 0; i < body.floor_segments.length; i++) {
        const segment = body.floor_segments[i];
        if (!segment.points || segment.points.length < 2) {
          return NextResponse.json(
            { error: `Floor segment ${i + 1} must have at least 2 points` },
            { status: 400 }
          );
        }
        if (!segment.floor_id) {
          return NextResponse.json(
            { error: `Floor segment ${i + 1} must have a floor_id` },
            { status: 400 }
          );
        }
      }
    } else {
      // Single floor validation
      if (!body.floor_id) {
        return NextResponse.json(
          { error: 'Floor ID is required for single-floor paths' },
          { status: 400 }
        );
      }
      if (!body.points || body.points.length < 2) {
        return NextResponse.json(
          { error: 'Single-floor paths must have at least 2 points' },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!body.name || !body.source || !body.destination) {
      return NextResponse.json(
        { error: 'Name, source, and destination are required' },
        { status: 400 }
      );
    }

    // Set default values for required fields
    const pathData = {
      ...body,
      shape: body.shape || 'circle',
      radius: body.radius || 0.01,
      color: body.color || '#3b82f6',
      is_published: body.is_published ?? false,
      created_by: body.created_by || 'user',
      datetime: Math.floor(Date.now() / 1000), // Unix timestamp
      status: body.status || 'active',
    };
    
    const response = await fetch(`${API_BASE_URL}/v1/path`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(pathData),
    });

    const responseText = await response.text();
    console.log('Backend response:', responseText);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
        return NextResponse.json(
          { error: 'Failed to create path - invalid response from server' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to create path' },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({
      success: true,
      message: 'Path created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
