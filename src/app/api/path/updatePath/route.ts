// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// export async function PUT(request: NextRequest) {
//   try {
//     // Extract pathId from URL search params or body
//     const url = new URL(request.url);
//     const pathId = url.searchParams.get('pathId');
    
//     if (!pathId) {
//       return NextResponse.json(
//         { error: 'Path ID is required' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();

//     console.log('Updating path:', pathId, 'with body:', body);
    
//     const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data.detail || 'Failed to update path' },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error updating path:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function PUT(request: NextRequest) {
  try {
    // Extract pathId from URL search params
    const url = new URL(request.url);
    const pathId = url.searchParams.get('pathId');
    
    if (!pathId) {
      return NextResponse.json(
        { error: 'Path ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    console.log('Updating path:', pathId, 'with body:', JSON.stringify(body, null, 2));

    // Add updated timestamp and user
    const updateData = {
      ...body,
      updated_by: body.updated_by || 'user',
      update_on: Math.floor(Date.now() / 1000), // Unix timestamp
    };
    
    const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(updateData),
    });

    const responseText = await response.text();
    console.log('Backend update response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
        return NextResponse.json(
          { error: 'Failed to update path - invalid response from server' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to update path' },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({
      success: true,
      message: 'Path updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
