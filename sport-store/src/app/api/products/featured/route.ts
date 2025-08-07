import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    
    // Gọi API backend trực tiếp không cần authentication
    const url = getBackendUrl(`/products/featured?limit=${limit}`);
    

    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Thêm cache để tối ưu hiệu suất
      next: { revalidate: 300 }, // Cache trong 5 phút
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
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in featured products API:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lấy sản phẩm nổi bật' },
      { status: 500 }
    );
  }
} 