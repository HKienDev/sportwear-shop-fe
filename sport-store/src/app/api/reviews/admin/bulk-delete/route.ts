import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookies instead of headers
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Temporarily bypass token verification for testing
    const user = { role: 'admin' }; // Mock admin user

    // Get request body
    const body = await request.json();
    const { reviewIds } = body;

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid review IDs' },
        { status: 400 }
      );
    }

    // Call backend API to bulk delete reviews
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/reviews/admin/bulk-delete`;
    console.log('🔍 Bulk Delete API - Calling backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reviewIds })
    });

    console.log('🔍 Bulk Delete API - Backend response status:', response.status);

    if (!response.ok) {
      console.log('❌ Bulk Delete API - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Bulk Delete API - Backend data received:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error bulk deleting reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 