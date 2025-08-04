import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Lấy access token từ cookie hoặc header Authorization
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    
    // Nếu không có token trong cookie, thử lấy từ header Authorization
    if (!accessToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7); // Loại bỏ 'Bearer ' prefix
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy productId từ params
    const { id: productId } = await params;
    const body = await request.json();
    const { isActive } = body;

    // Log request URL for debugging
    console.log('Updating product status:', productId, isActive);
    console.log('Requesting URL:', `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/status`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/status`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error updating product status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage
      },
      { status: 500 }
    );
  }
} 