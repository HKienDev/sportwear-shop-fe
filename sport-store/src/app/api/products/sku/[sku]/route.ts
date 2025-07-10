import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/sku/${decodedSku}`, {
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