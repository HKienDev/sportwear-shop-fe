import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để xóa giỏ hàng' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để xóa giỏ hàng
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/cart/clear`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể xóa giỏ hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể xóa giỏ hàng' },
      { status: 500 }
    );
  }
} 