import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7);
    // Lấy URL từ environment variable
    const apiUrl = getBackendBaseUrl();
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: 'Cấu hình API không hợp lệ' },
        { status: 500 }
      );
    }
    // Tạo URL cho backend API
    const backendUrl = `${apiUrl}/api/admin/users`;
    // Gọi backend API
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        return NextResponse.json(
          { success: false, message: 'Token không hợp lệ hoặc đã hết hạn' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, message: 'Không thể lấy danh sách người dùng', error: errorText },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: String(error) },
      { status: 500 }
    );
  }
} 