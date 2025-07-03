import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  console.log('🔧 PUT /api/cart/update called');
  try {
    const body = await request.json();
    const { sku, color, size, quantity = 1 } = body;
    
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    console.log('🔧 Auth header:', authHeader);
    const token = authHeader?.replace('Bearer ', '');
    console.log('🔧 Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('🔧 No token found, returning 401');
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để cập nhật giỏ hàng' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để cập nhật giỏ hàng
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/cart/update`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sku, color, size, quantity })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể cập nhật giỏ hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể cập nhật giỏ hàng' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🔧 POST /api/cart/update called - This should not happen!');
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Use PUT instead.' },
    { status: 405 }
  );
} 