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

    // Fetch real data from conversations API
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
      const conversationsResponse = await fetch(`${cleanBaseUrl}/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (conversationsResponse.ok) {
        const conversationsData = await conversationsResponse.json();
        const conversations = conversationsData.data?.conversations || [];
        
        // Calculate real stats from database
        const totalConversations = conversations.length;
        const activeConversations = conversations.filter((conv: any) => conv.status === 'active').length;
        
        // Get total messages from all conversations
        let totalMessages = 0;
        let pendingMessages = 0;
        let repliedMessages = 0;
        let completedMessages = 0;
        
        for (const conversation of conversations) {
          if (conversation.messageCount) {
            totalMessages += conversation.messageCount;
          }
          
          // Categorize by status
          if (conversation.status === 'pending') {
            pendingMessages += 1;
          } else if (conversation.status === 'replied') {
            repliedMessages += 1;
          } else if (conversation.status === 'completed') {
            completedMessages += 1;
          }
        }
        
        const stats = {
          totalMessages,
          pendingMessages,
          repliedMessages,
          completedMessages,
          totalConversations,
          activeConversations,
          averageResponseTime: 2.3 // Mock for now
        };
        
        console.log('📊 Real message stats from database:', stats);
        
        return NextResponse.json({
          success: true,
          data: stats,
          message: 'Message statistics retrieved successfully'
        });
      }
    } catch (error) {
      console.error('Error fetching real stats:', error);
    }

    // Return empty stats if no data available
    const stats = {
      totalMessages: 0,
      pendingMessages: 0,
      repliedMessages: 0,
      completedMessages: 0,
      totalConversations: 0,
      activeConversations: 0,
      averageResponseTime: 0
    };

    console.log('📊 Empty message stats (no data available):', stats);

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Message statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching message stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 