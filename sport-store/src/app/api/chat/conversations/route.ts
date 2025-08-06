import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/api';

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

    // Sử dụng utility function để tạo URL
    const backendUrl = getBackendUrl('/chat/conversations');

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
        { success: false, message: 'Không thể lấy danh sách cuộc trò chuyện' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chat Conversations API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 