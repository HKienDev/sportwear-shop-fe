import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function POST(request: NextRequest) {
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

    // Lấy dữ liệu từ request body
    const body = await request.json();
    const { conversationId, message, senderId, senderName } = body;

    if (!conversationId || !message) {
      return NextResponse.json(
        { success: false, message: 'ConversationId và message là bắt buộc' },
        { status: 400 }
      );
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

    const backendUrl = `${apiUrl}/chat/send`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        message,
        senderId,
        senderName
      }),
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
        { success: false, message: 'Không thể gửi tin nhắn' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chat Send Message API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 