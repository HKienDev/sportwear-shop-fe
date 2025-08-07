import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search');

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });

    const response = await fetch(
      getBackendUrl(`/categories?${queryParams}`),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch categories');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal Server Error' 
      },
      { status: 500 }
    );
  }
} 

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
    
    console.log('POST category request with body:', body);
    
    // Validate body
    if (!body || !body.name || !body.image) {
      console.error('POST /api/categories: Invalid body:', body);
      return NextResponse.json(
        { success: false, message: 'Invalid request body: name and image are required', body },
        { status: 400 }
      );
    }
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('accessToken')?.value;

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = getBackendUrl('/categories');
    console.log('Calling backend POST:', backendUrl);
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create category' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 