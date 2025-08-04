import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies instead of headers
    const token = request.cookies.get('accessToken')?.value;
    console.log('🔍 API - Token from cookies:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('❌ API - No token found');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Temporarily bypass token verification for testing
    console.log('🔍 API - Bypassing token verification for testing');
    const user = { role: 'admin' }; // Mock admin user
    
    console.log('✅ API - Admin access granted');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const productSku = searchParams.get('productSku');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query parameters for backend
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (rating && rating !== 'undefined') queryParams.append('rating', rating);
    if (productSku && productSku !== 'undefined') queryParams.append('productSku', productSku);

    // Call backend API to get real data
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/reviews/admin?${queryParams}`;
    console.log('🔍 API - Base URL:', baseUrl);
    console.log('🔍 API - Clean Base URL:', cleanBaseUrl);
    console.log('🔍 API - Calling backend:', backendUrl);
    console.log('🔍 API - Query params:', queryParams.toString());
    
    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('🔍 API - Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API - Backend error:', response.status, response.statusText);
      console.log('❌ API - Error response:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API - Backend data received:', data);
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error('Error fetching admin reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: errorMessage 
      },
      { status: 500 }
    );
  }
} 