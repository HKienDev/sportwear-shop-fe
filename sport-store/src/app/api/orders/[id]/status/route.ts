import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để cập nhật trạng thái đơn hàng' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để cập nhật trạng thái đơn hàng
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`;
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể cập nhật trạng thái đơn hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể cập nhật trạng thái đơn hàng' },
      { status: 500 }
    );
  }
} 