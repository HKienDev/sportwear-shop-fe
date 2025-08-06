import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID là bắt buộc' },
        { status: 400 }
      );
    }

    // Gọi API backend để lấy chat history
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    // Remove /api if it's already in the baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
    const backendUrl = `${cleanBaseUrl}/api/chat/history/${userId}`;
    
    console.log('🔍 Chat history API - Calling backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('🔍 Chat history API - Backend response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error loading chat history:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi tải lịch sử chat' },
      { status: 500 }
    );
  }
} 