import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/apiAuth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Get Questions API called');
    
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user, accessToken } = authResult;
    console.log('🔑 User authenticated:', user._id);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status') || '';
    const productSku = searchParams.get('productSku') || '';

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (status) queryParams.append('status', status);
    if (productSku) queryParams.append('productSku', productSku);

    // Get API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL not configured');
      return NextResponse.json(
        { success: false, message: 'Cấu hình API không hợp lệ' },
        { status: 500 }
      );
    }

    // Call backend API
    const backendUrl = `${apiUrl}/questions?${queryParams.toString()}`;
    console.log('🌐 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
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
        { success: false, message: 'Không thể lấy danh sách câu hỏi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend response data received');

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Get Questions API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Create Question API called');
    
    // Check authentication
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user, accessToken } = authResult;
    console.log('🔑 User authenticated:', user._id);

    // Lấy body từ request
    const body = await request.json();
    console.log('📤 Request body:', body);

    // Validate required fields
    const { productSku, question } = body;
    if (!productSku || !question) {
      return NextResponse.json(
        { success: false, message: 'SKU sản phẩm và nội dung câu hỏi là bắt buộc' },
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
    const backendUrl = `${apiUrl}/questions`;
    console.log('🌐 Backend URL:', backendUrl);

    // Gọi backend API
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productSku,
        question
      }),
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      
      return NextResponse.json(
        { success: false, message: 'Không thể tạo câu hỏi' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend response data received');

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Create Question API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 