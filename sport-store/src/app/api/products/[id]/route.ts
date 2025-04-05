import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Lấy access token từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sku = params.id;

    // Log request URL for debugging
    console.log('Deleting product with SKU:', sku);
    console.log('Requesting URL:', `${process.env.NEXT_PUBLIC_API_URL}/products/${sku}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${sku}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal Server Error' 
      },
      { status: 500 }
    );
  }
} 