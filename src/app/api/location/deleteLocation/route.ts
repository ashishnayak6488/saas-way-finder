import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// DELETE Location
export async function DELETE(
  request: NextRequest,
  { params }: { params: { locationId: string } }
) {
  try {
    console.log('Location API DELETE called for ID:', params.locationId);
    
    const apiUrl = `${API_BASE_URL}/v1/location/${params.locationId}`;
    console.log('Calling FastAPI at:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
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
        console.error('Delete error:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('Could not parse error response:', responseText);
      }
      
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to delete location', details: errorData },
        { status: response.status }
      );
    }

    // Handle empty response for successful deletion
    let data = {};
    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // If response is not JSON, create a success response
        data = { status: 'success', message: 'Location deleted successfully' };
      }
    } else {
      data = { status: 'success', message: 'Location deleted successfully' };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// // GET Single Location (optional)
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { locationId: string } }
// ) {
//   try {
//     console.log('Location API GET called for ID:', params.locationId);
    
//     const apiUrl = `${API_BASE_URL}/v1/location/${params.locationId}`;
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
//       } catch (e) {
//         console.error('Could not parse error response:', responseText);
//       }
      
//       return NextResponse.json(
//         { error: errorData?.detail || 'Failed to fetch location', details: errorData },
//         { status: response.status }
//       );
//     }

//     const data = JSON.parse(responseText);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching location:', error);
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message },
//       { status: 500 }
//     );
//   }
// }
