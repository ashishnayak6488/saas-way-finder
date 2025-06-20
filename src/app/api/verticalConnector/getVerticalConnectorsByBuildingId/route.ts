import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Creating vertical connector with data:', body);
    
    const apiUrl = `${API_BASE_URL}/v1/verticalConnector`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('Create vertical connector API response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
      }
      
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to create vertical connector', details: errorData },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating vertical connector:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const floorId = searchParams.get('floor_id');
    const sharedId = searchParams.get('shared_id');
    const buildingId = searchParams.get('building_id');
    
    let apiUrl: string;
    
    apiUrl = `${API_BASE_URL}/v1/verticalConnector/building/${buildingId}`;

    
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
    
    // Transform response for floor-specific queries
    if (data.data && data.data.connectors) {
      return NextResponse.json({
        ...data,
        data: data.data.connectors
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
