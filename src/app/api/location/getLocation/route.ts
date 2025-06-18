import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const floorId = searchParams.get('floor_id');
      const buildingId = searchParams.get('building_id');
      const isPublished = searchParams.get('is_published');
      
      let url = `${API_BASE_URL}/v1/location`;
      const params = new URLSearchParams();
      
      if (floorId) params.append('floor_id', floorId);
      if (buildingId) params.append('building_id', buildingId);
      if (isPublished) params.append('is_published', isPublished);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
  
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
          { error: data.detail || 'Failed to fetch locations' },
          { status: response.status }
        );
      }
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }