import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

const API_URL = getBackendBaseUrl();

export async function GET(request: NextRequest) {
  try {

    
    // Lấy token từ cookie hoặc Authorization header
    const cookieStore = await cookies();
    let token = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    
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
    
    // Lấy query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '8';
    
    // Gọi backend API trực tiếp
    const response = await fetch(`${API_URL}/api/orders/my-orders?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Không thể lấy danh sách đơn hàng' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể lấy danh sách đơn hàng' },
      { status: 500 }
    );
  }
} 