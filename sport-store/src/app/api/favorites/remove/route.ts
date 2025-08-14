import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/utils/backendUrl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;
    
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để xóa sản phẩm khỏi danh sách yêu thích' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để xóa khỏi danh sách yêu thích
    const apiUrl = getBackendBaseUrl();
    const response = await fetch(`${apiUrl}/api/favorites/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể xóa sản phẩm khỏi danh sách yêu thích' },
      { status: 500 }
    );
  }
}
