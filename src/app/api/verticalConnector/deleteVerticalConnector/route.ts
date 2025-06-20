import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectorId = searchParams.get('connectorId');
    
    if (!connectorId) {
      return NextResponse.json(
        { error: 'Connector ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Deleting vertical connector:', connectorId);
    
    const apiUrl = `${API_BASE_URL}/v1/verticalConnector/${connectorId}`;
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const responseText = await response.text();
    console.log('FastAPI delete response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Could not parse error response:', responseText);
      }
      
      return NextResponse.json(
        { error: errorData?.detail || 'Failed to delete vertical connector', details: errorData },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting vertical connector:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
