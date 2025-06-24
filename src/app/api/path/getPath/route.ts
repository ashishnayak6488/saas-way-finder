import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const floorId = searchParams.get('floorId');
    const isPublished = searchParams.get('is_published');
    const statusFilter = searchParams.get('status_filter') || 'active';
    
    if (!floorId) {
      return NextResponse.json(
        { error: 'Floor ID is required' },
        { status: 400 }
      );
    }
    
    // Build query string for FastAPI
    const queryParams = new URLSearchParams();
    if (isPublished !== null) {
      queryParams.append('is_published', isPublished);
    }
    queryParams.append('status_filter', statusFilter);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/v1/path/floor/${floorId}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching paths from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to fetch paths' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching paths:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
