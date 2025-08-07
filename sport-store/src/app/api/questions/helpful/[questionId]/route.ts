import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;

    
    // Lấy URL từ environment variable
    const apiUrl = getBackendBaseUrl();
    if (!apiUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL not configured');
      return NextResponse.json(
        { success: false, message: 'Cấu hình API không hợp lệ' },
        { status: 500 }
      );
    }

    // Tạo URL cho backend API
    const backendUrl = `${apiUrl}/questions/helpful/${questionId}`;
    console.log('🌐 Backend URL:', backendUrl);

    // Gọi backend API
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });



    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      
      return NextResponse.json(
        { success: false, message: 'Không thể đánh dấu câu hỏi' },
        { status: response.status }
      );
    }

    const data = await response.json();


    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Mark Question Helpful API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 