import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const decodedCategoryId = decodeURIComponent(categoryId);
    const body = await request.json();
    
    console.log('PUT category request for ID:', decodedCategoryId, 'with body:', body);
    
    // Validate body
    if (!body || (typeof body.isActive !== 'boolean' && typeof body.showInNewProducts !== 'boolean')) {
      console.error('PUT /api/categories/[categoryId]: Invalid body:', body);
      return NextResponse.json(
        { success: false, message: 'Invalid request body: isActive or showInNewProducts must be a boolean', body },
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

    const API_URL = getBackendBaseUrl();

    const response = await fetch(`${API_URL}/api/categories/${decodedCategoryId}`, {
      method: 'PUT',
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
        { success: false, message: data.message || 'Failed to update category' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const decodedCategoryId = decodeURIComponent(categoryId);
    
    console.log('DELETE category request for ID:', decodedCategoryId);
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('accessToken')?.value;

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const API_URL = getBackendBaseUrl();

    const response = await fetch(`${API_URL}/api/categories/${decodedCategoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to delete category' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 