import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params: { sku: string } }
) {
  try {
    // Lấy token từ header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7); // Loại bỏ 'Bearer ' prefix

    // Lấy SKU từ params
    const sku = context.params.sku;
    if (!sku) {
      return NextResponse.json(
        { message: 'Product SKU is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Log request URL for debugging
    console.log('Updating product status with SKU:', sku);
    console.log('Request body:', body);
    console.log('Requesting URL:', `${process.env.NEXT_PUBLIC_API_URL}/products/${sku}/status`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${sku}/status`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from backend:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to update product status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update product status' },
      { status: 500 }
    );
  }
} 