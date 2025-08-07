import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productSku: string }> }
) {
  try {
    const { productSku } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status') || 'approved';


    
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
    const backendUrl = `${apiUrl}/questions/product/${productSku}?page=${page}&limit=${limit}&status=${status}`;
    console.log('🌐 Backend URL:', backendUrl);

    // Gọi backend API
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });



    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      
      return NextResponse.json(
        { success: false, message: 'Không thể lấy danh sách câu hỏi' },
        { status: response.status }
      );
    }

    const data = await response.json();


    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Product Questions API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 