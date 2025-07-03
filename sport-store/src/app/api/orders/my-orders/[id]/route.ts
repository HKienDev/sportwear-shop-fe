import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Lấy token từ cookie hoặc Authorization header
    const cookieStore = await cookies();
    let token = cookieStore.get('accessToken')?.value;
    
    // Nếu không có token trong cookie, thử lấy từ Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    console.log('🔍 Token check:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      cookieNames: Array.from(cookieStore.getAll().map(c => c.name)),
      hasAuthHeader: !!request.headers.get('authorization')
    });
    
    if (!token) {
      console.log('❌ No token found in cookies or headers');
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy token xác thực' },
        { status: 401 }
      );
    }
    
    // Gọi backend API trực tiếp
    console.log('🔍 Calling backend API:', `${API_URL}/orders/my-orders/${id}`);
    
    const response = await fetch(`${API_URL}/orders/my-orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    });

    const data = await response.json();
    console.log('🔍 Backend response:', { status: response.status, success: data.success, hasData: !!data.data });

    if (response.ok && data.success) {
      console.log('✅ Returning order data');
      return NextResponse.json(data);
    } else {
      console.log('❌ Backend error:', data.message);
      return NextResponse.json(
        { success: false, message: data.message || 'Không thể tải thông tin đơn hàng' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể tải thông tin đơn hàng' },
      { status: 500 }
    );
  }
} 