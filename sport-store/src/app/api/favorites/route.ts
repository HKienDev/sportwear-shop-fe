import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/utils/backendUrl';

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để xem danh sách yêu thích' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để lấy danh sách yêu thích
    const apiUrl = getBackendBaseUrl();
    const response = await fetch(`${apiUrl}/api/favorites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể lấy danh sách yêu thích' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể lấy danh sách yêu thích' },
      { status: 500 }
    );
  }
}
