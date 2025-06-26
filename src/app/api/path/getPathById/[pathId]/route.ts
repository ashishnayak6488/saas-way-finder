import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(
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
    
    console.log('Fetching path by ID:', pathId);
    
    const response = await fetch(`${API_BASE_URL}/v1/path/${pathId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
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
          { error: 'Failed to fetch path - invalid response from server' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || errorData.message || 'Failed to fetch path' },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching path:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
