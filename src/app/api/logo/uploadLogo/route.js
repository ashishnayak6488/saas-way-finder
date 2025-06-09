import { NextResponse } from 'next/server';
import { getAuthToken } from '@/src/middleware';

export async function POST(request) {
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

    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to your backend API
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization/addLogo?entity_uuid=${entity_uuid}`;
    
    // Create a new FormData object to send to the backend
    const backendFormData = new FormData();
    
    // Get the logo file from the request and append it to the new FormData
    const logoFile = formData.get('logo');
    if (!logoFile) {
      return NextResponse.json(
        { message: 'No logo file provided' },
        { status: 400 }
      );
    }
    
    backendFormData.append('logo', logoFile);

    // Send the request to the backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData?.detail || 'Failed to upload organization logo' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
