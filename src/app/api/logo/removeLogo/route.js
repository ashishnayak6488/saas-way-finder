import { NextResponse } from 'next/server';
import { getAuthToken } from '@/src/middleware';

export async function DELETE(request) {
  try {
    // Get entity_uuid from URL query parameters
    const url = new URL(request.url);
    const entity_uuid = url.searchParams.get('entity_uuid');
    
    if (!entity_uuid) {
      return NextResponse.json(
        { message: 'Missing entity_uuid parameter' },
        { status: 400 }
      );
    }

    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: Token missing' },
        { status: 401 }
      );
    }

    // Send the request to the backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization/addLogo/${entity_uuid}?entity_uuid=${entity_uuid}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData?.detail || 'Failed to remove organization logo' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing logo:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
