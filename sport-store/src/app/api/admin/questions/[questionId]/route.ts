import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/admin/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi xóa câu hỏi' },
      { status: 500 }
    );
  }
} 