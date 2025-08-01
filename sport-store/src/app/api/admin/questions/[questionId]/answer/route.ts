import { NextRequest, NextResponse } from 'next/server';

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
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/admin/${questionId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi trả lời câu hỏi' },
      { status: 500 }
    );
  }
} 