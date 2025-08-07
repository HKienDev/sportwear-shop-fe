import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function GET(request: NextRequest) {
  try {
    // Get cookies from request
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const response = await fetch(getBackendUrl(`/questions/admin/pending?${queryParams.toString()}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching pending questions:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi lấy danh sách câu hỏi chờ phê duyệt' },
      { status: 500 }
    );
  }
} 