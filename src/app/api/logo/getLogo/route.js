import { NextResponse } from 'next/server';
import { getAuthToken } from '@/src/middleware';
export async function GET(request) {
    try {

        const token = await getAuthToken();
        
            const controller = new AbortController();
        
            if (!token) {
              return NextResponse.json(
                { message: "Unauthorized: Token missing" },
                { status: 401 }
              );
            }

        // Construct the URL with query parameters
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/organization/addLogo`);

        // Fetch data from the backend API
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            signal: controller.signal,
        });

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData?.message || 'Failed to fetch content' },
                { status: response.status }
            );
        }

        // Return the fetched data
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        // Handle unexpected errors
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
