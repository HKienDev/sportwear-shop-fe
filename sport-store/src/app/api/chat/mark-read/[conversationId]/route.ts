import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    
    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: 'ConversationId là bắt buộc' },
        { status: 400 }
      );
    }

    // Lấy token từ header (optional cho khách vãng lai)
    const authHeader = request.headers.get('authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Gọi backend API
    const apiUrl = getBackendBaseUrl();
    if (!apiUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL not configured');
      return NextResponse.json(
        { success: false, message: 'Cấu hình API không hợp lệ' },
        { status: 500 }
      );
    }

    const backendUrl = `${apiUrl}/api/chat/mark-read/${conversationId}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Chỉ thêm Authorization header nếu có token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers,
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
        { success: false, message: 'Không thể đánh dấu đã đọc' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chat Mark Read API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 