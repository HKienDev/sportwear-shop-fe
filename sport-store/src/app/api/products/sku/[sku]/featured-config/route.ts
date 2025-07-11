import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const decodedSku = decodeURIComponent(sku);
    const body = await request.json();
    
    console.log('PATCH featured-config request for SKU:', decodedSku, 'with body:', body);
    
    // Validate body
    if (!body || typeof body.countdownEndDate !== 'string' || 
        typeof body.soldCount !== 'number' || 
        typeof body.remainingStock !== 'number' || 
        typeof body.isActive !== 'boolean') {
      console.error('PATCH /api/products/sku/[sku]/featured-config: Invalid body:', body);
      return NextResponse.json(
        { success: false, message: 'Invalid request body: missing required fields', body },
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

    console.log('Calling backend PATCH:', `http://localhost:4000/api/products/sku/${decodedSku}/featured-config`);
    const response = await fetch(`http://localhost:4000/api/products/sku/${decodedSku}/featured-config`, {
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
        { success: false, message: data.message || 'Failed to update product featured config' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product featured config:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 