import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

    // Lấy token từ header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Gọi backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL not configured');
      return NextResponse.json(
        { success: false, message: 'Cấu hình API không hợp lệ' },
        { status: 500 }
      );
    }

    const backendUrl = `${apiUrl}/chat/messages/${conversationId}`;
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
        { success: false, message: 'Không thể lấy tin nhắn' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chat Messages API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 