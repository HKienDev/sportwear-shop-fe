import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';

export async function GET(request: NextRequest) {
  try {
    // Lấy access token từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token và kiểm tra role (có thể thêm logic verify token ở đây)
    // Tạm thời bỏ qua việc verify token để test

    // Mock data for now - replace with real database queries
    const conversations = [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        lastMessage: 'Xin chào, tôi cần hỗ trợ',
        unread: 2,
        messageCount: 15,
        lastMessageTime: '2024-01-15T10:30:00Z',
        userInfo: {
          fullname: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phone: '0123456789'
        },
        status: 'pending',
        priority: 'normal',
        tags: ['hỗ trợ', 'sản phẩm']
      },
      {
        id: '2',
        name: 'Trần Thị B',
        lastMessage: 'Cảm ơn bạn đã hỗ trợ',
        unread: 0,
        messageCount: 8,
        lastMessageTime: '2024-01-15T09:15:00Z',
        userInfo: {
          fullname: 'Trần Thị B',
          email: 'tranthib@example.com',
          phone: '0987654321'
        },
        status: 'replied',
        priority: 'high',
        tags: ['thanh toán', 'đơn hàng']
      }
    ];

    const stats = {
      totalMessages: 1234,
      pendingMessages: 12,
      repliedMessages: 5,
      completedMessages: 1217,
      totalConversations: 89,
      activeConversations: 15,
      averageResponseTime: 2.3
    };

    return NextResponse.json({
      success: true,
      data: {
        conversations,
        stats
      },
      message: 'Conversations and stats retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching conversations with stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 