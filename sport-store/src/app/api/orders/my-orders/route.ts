import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting my-orders API route...');
    
    // Lấy token từ cookie hoặc Authorization header
    const cookieStore = await cookies();
    let token = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    
    // Nếu không có token trong cookie, thử lấy từ Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      console.log('🔍 Auth header:', authHeader);
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('🔍 Token extracted from header, length:', token?.length);
      }
    }
    
    console.log('🔍 Token check for my-orders:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      cookieNames: Array.from(cookieStore.getAll().map(c => c.name)),
      hasAuthHeader: !!request.headers.get('authorization'),
      allHeaders: Object.fromEntries(request.headers.entries())
    });
    
    if (!token) {
      console.log('❌ No token found in cookies or headers for my-orders');
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
    console.log('🔍 Calling backend API for my-orders:', `${API_URL}/orders/my-orders?page=${page}&limit=${limit}`);
    
    const response = await fetch(`${API_URL}/orders/my-orders?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      }
    });

    const data = await response.json();
    console.log('🔍 Backend response for my-orders:', { status: response.status, success: data.success, hasData: !!data.data });
    
    if (!response.ok) {
      console.log('❌ Backend error for my-orders:', data);
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