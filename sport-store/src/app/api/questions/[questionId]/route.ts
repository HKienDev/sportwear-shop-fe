import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/apiAuth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    console.log('🔍 Delete Question API called for question:', questionId);
    
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user, accessToken } = authResult;
    console.log('🔑 User authenticated:', user._id);

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
    const backendUrl = `${apiUrl}/questions/${questionId}`;
    console.log('🌐 Backend URL:', backendUrl);

    // Gọi backend API
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      
      return NextResponse.json(
        { success: false, message: 'Không thể xóa câu hỏi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend response data received');

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Delete Question API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 