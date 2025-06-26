import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pathId: string } }
) {
  try {
    const { pathId } = params;
    
    if (!pathId) {
      return NextResponse.json(
        { error: 'Path ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { is_published } = body;

    if (typeof is_published !== 'boolean') {
      return NextResponse.json(
        { error: 'is_published must be a boolean value' },
        { status: 400 }
      );
    }

    console.log('Toggling publish status for path:', pathId, 'to:', is_published);

    // Prepare update data
    const updateData = {
      is_published,
      updated_by: body.updated_by || 'user',
      update_on: Math.floor(Date.now() / 1000), // Unix timestamp
    };
    
    const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(updateData),
    });

    const responseText = await response.text();
    console.log('Backend toggle publish response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
        return NextResponse.json(
          { error: 'Failed to toggle publish status - invalid response from server' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to toggle publish status' },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({
      success: true,
      message: `Path ${is_published ? 'published' : 'unpublished'} successfully`,
      data: data
    });
  } catch (error) {
    console.error('Error toggling path publish status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// // Alternative endpoint that uses PUT method (in case backend expects PUT)
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { pathId: string } }
// ) {
//   try {
//     const { pathId } = params;
    
//     if (!pathId) {
//       return NextResponse.json(
//         { error: 'Path ID is required' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
//     const { is_published } = body;

//     if (typeof is_published !== 'boolean') {
//       return NextResponse.json(
//         { error: 'is_published must be a boolean value' },
//         { status: 400 }
//       );
//     }

//     console.log('Toggling publish status (PUT) for path:', pathId, 'to:', is_published);

//     // Prepare update data
//     const updateData = {
//       is_published,
//       updated_by: body.updated_by || 'user',
//       update_on: Math.floor(Date.now() / 1000), // Unix timestamp
//     };
    
//     const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//       body: JSON.stringify(updateData),
//     });

//     const responseText = await response.text();
//     console.log('Backend toggle publish response (PUT):', responseText);

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//       } catch (e) {
//         console.error('Could not parse error response:', responseText);
//         return NextResponse.json(
//           { error: 'Failed to toggle publish status - invalid response from server' },
//           { status: response.status }
//         );
//       }
      
//       return NextResponse.json(
//         { error: errorData.detail || errorData.message || 'Failed to toggle publish status' },
//         { status: response.status }
//       );
//     }

//     const data = JSON.parse(responseText);
//     return NextResponse.json({
//       success: true,
//       message: `Path ${is_published ? 'published' : 'unpublished'} successfully`,
//       data: data
//     });
//   } catch (error) {
//     console.error('Error toggling path publish status:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
