import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminReply } = await request.json();

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;
    console.log('🔍 Reply API - Token from cookies:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('❌ Reply API - No token found');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Temporarily bypass token verification for testing
    console.log('🔍 Reply API - Bypassing token verification for testing');
    const user = { role: 'admin' }; // Mock admin user
    
    console.log('✅ Reply API - Admin access granted');

    // Call backend API to reply to review
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/reviews/admin/${id}/reply`;
    console.log('🔍 Reply API - Calling backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminReply })
    });

    console.log('🔍 Reply API - Backend response status:', response.status);

    if (!response.ok) {
      console.log('❌ Reply API - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Reply API - Backend data received:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error replying to review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;
    console.log('🔍 Delete Reply API - Token from cookies:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('❌ Delete Reply API - No token found');
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Temporarily bypass token verification for testing
    console.log('🔍 Delete Reply API - Bypassing token verification for testing');
    const user = { role: 'admin' }; // Mock admin user
    
    console.log('✅ Delete Reply API - Admin access granted');

    // Call backend API to delete admin reply
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/reviews/admin/${id}/reply`;
    console.log('🔍 Delete Reply API - Calling backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('🔍 Delete Reply API - Backend response status:', response.status);

    if (!response.ok) {
      console.log('❌ Delete Reply API - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Delete Reply API - Backend data received:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error deleting admin reply:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 