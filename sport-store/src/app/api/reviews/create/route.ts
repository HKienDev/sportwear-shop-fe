import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    console.log('🔍 Review API - Token present:', !!token);
    console.log('🔍 Review API - Token length:', token?.length);
    
    if (!token) {
      console.log('❌ Review API - No access token found');
      return NextResponse.json(
        { success: false, message: 'No access token found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productSku, orderId, rating, title, comment, images = [] } = body;

    // Validate required fields
    if (!productSku || !orderId || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔍 Review API - Calling backend with data:', {
      productSku,
      orderId,
      rating,
      title: title.substring(0, 20) + '...',
      comment: comment.substring(0, 20) + '...',
      imagesCount: images.length
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productSku,
        orderId,
        rating,
        title,
        comment,
        images
      }),
    });

    console.log('🔍 Review API - Backend response status:', response.status);

    const data = await response.json();
    console.log('🔍 Review API - Backend response data:', data);

    if (!response.ok) {
      console.log('❌ Review API - Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create review' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create review' },
      { status: 500 }
    );
  }
} 