import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminReply } = await request.json();

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Temporarily bypass token verification for testing
    const user = { role: 'admin' }; // Mock admin user

    // Call backend API to reply to review
    const baseUrl = getBackendBaseUrl();
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/reviews/admin/${id}/reply`;
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ adminReply })
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
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

    
    if (!token) {
  
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Temporarily bypass token verification for testing

    const user = { role: 'admin' }; // Mock admin user
    


    // Call backend API to delete admin reply
    const baseUrl = getBackendBaseUrl();
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/reviews/admin/${id}/reply`;

    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });



    if (!response.ok) {
  
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error deleting admin reply:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 