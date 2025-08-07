import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    // Get cookies from request
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { success: false, message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const { questionId } = await params;

    const response = await fetch(getBackendUrl(`/questions/admin/${questionId}/verify`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error verifying question:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi xác minh câu hỏi' },
      { status: 500 }
    );
  }
} 