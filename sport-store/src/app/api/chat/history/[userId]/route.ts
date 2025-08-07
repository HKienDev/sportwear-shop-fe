import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

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
    const backendUrl = getBackendUrl(`/chat/history/${userId}`);
    

    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    

    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error loading chat history:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi tải lịch sử chat' },
      { status: 500 }
    );
  }
} 