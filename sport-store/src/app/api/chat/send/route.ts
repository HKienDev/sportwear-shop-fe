import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Chat Send Message API called');
    
    // Lấy token từ header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('🔑 Token extracted:', token ? 'Present' : 'Missing');

    // Lấy body từ request
    const body = await request.json();
    console.log('📤 Request body:', body);

    // Validate required fields
    const { conversationId, message, senderId, senderName } = body;
    if (!conversationId || !message || !senderId) {
      return NextResponse.json(
        { success: false, message: 'ConversationId, message và senderId là bắt buộc' },
        { status: 400 }
      );
    }

    // Lấy URL từ environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL not configured');
      return NextResponse.json(
        { success: false, message: 'Cấu hình API không hợp lệ' },
        { status: 500 }
      );
    }

    // Tạo URL cho backend API
    const backendUrl = `${apiUrl}/chat/send`;
    console.log('🌐 Backend URL:', backendUrl);

    // Gọi backend API
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
        senderName: senderName || senderId
      }),
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      
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
    console.log('✅ Backend response data received');

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chat Send Message API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 