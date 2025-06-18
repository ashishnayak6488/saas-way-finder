import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// UPDATE Location
export async function PUT(
  request: NextRequest,
  { params }: { params: { locationId: string } }
) {
  try {
    console.log('Location API PUT called for ID:', params.locationId);
    const body = await request.json();
    console.log('Update request body:', JSON.stringify(body, null, 2));
    
    const apiUrl = `${API_BASE_URL}/v1/location/${params.locationId}`;
    console.log('Calling FastAPI at:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    console.log('FastAPI response status:', response.status);
    
    const responseText = await response.text();
    console.log('FastAPI response text:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Update error:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('Could not parse error response:', responseText);
      }
      
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to update location', details: errorData },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}