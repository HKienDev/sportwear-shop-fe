import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Thử lấy data từ body trước
    let sku, color, size;
    
    try {
      const body = await request.json();
      ({ sku, color, size } = body);
    } catch {
      // Nếu không đọc được body, thử lấy từ query params
      const url = new URL(request.url);
      sku = url.searchParams.get('sku');
      color = url.searchParams.get('color');
      size = url.searchParams.get('size');
    }
    
    console.log('🛒 Cart remove request:', { sku, color, size });
    
    if (!sku) {
      return NextResponse.json(
        { success: false, message: 'SKU sản phẩm là bắt buộc' },
        { status: 400 }
      );
    }
    
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token found');
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để xóa sản phẩm khỏi giỏ hàng
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/cart/remove`;
    console.log('🌐 Calling backend API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sku, color, size })
    });
    
    console.log('📡 Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Backend error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể xóa sản phẩm khỏi giỏ hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Backend success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể xóa sản phẩm khỏi giỏ hàng' },
      { status: 500 }
    );
  }
} 