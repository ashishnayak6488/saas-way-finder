// import { NextRequest, NextResponse } from 'next/server';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// export async function DELETE(request: NextRequest) {
//   try {
//     // Extract pathId from URL search params
//     const url = new URL(request.url);
//     const pathId = url.searchParams.get('pathId');
    
//     if (!pathId) {
//       return NextResponse.json(
//         { error: 'Path ID is required' },
//         { status: 400 }
//       );
//     }

//     console.log('Deleting path:', pathId);
    
//     const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Cookie': request.headers.get('cookie') || '',
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data.detail || 'Failed to delete path' },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error deleting path:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function DELETE(request: NextRequest) {
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

    console.log('Deleting path:', pathId);
    
    const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        const responseText = await response.text();
        errorData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Could not parse error response');
        return NextResponse.json(
          { error: 'Failed to delete path - invalid response from server' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to delete path' },
        { status: response.status }
      );
    }

    // Handle both JSON and empty responses
    let data = {};
    try {
      const responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (e) {
      // Empty response is OK for DELETE
      console.log('Empty response from delete operation');
    }

    return NextResponse.json({
      success: true,
      message: 'Path deleted successfully',
      data: data
    });
  } catch (error) {
    console.error('Error deleting path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
