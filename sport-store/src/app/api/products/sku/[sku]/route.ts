import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_CONFIG } from '@/config/token';

export async function DELETE(
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

    // Log request URL for debugging
    console.log('Deleting product with SKU:', sku);
    console.log('Requesting URL:', `${process.env.NEXT_PUBLIC_API_URL}/products/${sku}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${sku}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from backend:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to delete product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
} 