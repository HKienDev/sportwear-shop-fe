import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

const API_URL = getBackendBaseUrl();

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
    

    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy token xác thực' },
        { status: 401 }
      );
    }
    
    // Gọi backend API trực tiếp
    const response = await fetch(`${API_URL}/api/orders/my-orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return NextResponse.json(data);
    } else {
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