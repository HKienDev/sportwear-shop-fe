import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    
    console.log('🔄 Getting featured products with limit:', limit);
    
    // Gọi API backend trực tiếp không cần authentication
    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    // Đảm bảo API_URL không kết thúc bằng /api để tránh duplicate
    if (API_URL.endsWith('/api')) {
      API_URL = API_URL.slice(0, -4); // Loại bỏ /api ở cuối
    }
    
    const url = `${API_URL}/api/products/featured?limit=${limit}`;
    console.log('🌐 Calling backend URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể lấy sản phẩm nổi bật' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Featured products response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in featured products API:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lấy sản phẩm nổi bật' },
      { status: 500 }
    );
  }
} 