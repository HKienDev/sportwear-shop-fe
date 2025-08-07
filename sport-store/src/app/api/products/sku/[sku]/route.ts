import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const decodedSku = decodeURIComponent(sku);
    
    // Lấy token từ cookie
    const cookieHeader = req.headers.get('cookie');
    let accessToken = '';
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      accessToken = cookies.accessToken || '';
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Thêm Authorization header nếu có token
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(getBackendUrl(`/products/sku/${decodedSku}`), {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const decodedSku = decodeURIComponent(sku);
    console.log('DELETE request for SKU:', decodedSku);
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('accessToken')?.value;

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const deleteUrl = getBackendUrl(`/products/${decodedSku}`);
    console.log('Calling backend DELETE:', deleteUrl);
    const response = await fetch(deleteUrl, {
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
        { success: false, message: data.message || 'Failed to delete product' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const decodedSku = decodeURIComponent(sku);
    const body = await request.json();
    
    console.log('PATCH request for SKU:', decodedSku, 'with body:', body);
    
    // Validate body
    if (!body || typeof body.isActive !== 'boolean') {
      console.error('PATCH /api/products/sku/[sku]: Invalid body:', body);
      return NextResponse.json(
        { success: false, message: 'Invalid request body: isActive must be a boolean', body },
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

    const patchUrl = getBackendUrl(`/products/${decodedSku}/status`);
    console.log('Calling backend PATCH:', patchUrl);
    const response = await fetch(patchUrl, {
      method: 'PATCH',
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
        { success: false, message: data.message || 'Failed to update product status' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 