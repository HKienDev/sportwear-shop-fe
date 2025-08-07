import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'UserId là bắt buộc' },
        { status: 400 }
      );
    }

    // Chỉ cho phép xóa tin nhắn của temp user (khách vãng lai)
    if (!userId.startsWith('temp_')) {
      return NextResponse.json(
        { success: false, message: 'Chỉ có thể xóa tin nhắn của khách vãng lai' },
        { status: 403 }
      );
    }

    // Gọi backend API để xóa tin nhắn
    const apiUrl = getBackendUrl('/chat/clear-guest-messages');
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error('❌ Backend clear messages error:', response.status);
      return NextResponse.json(
        { success: false, message: 'Lỗi xóa tin nhắn' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Chat clear messages error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
}
