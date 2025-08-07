import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl, getBackendBaseUrl } from '@/utils/backendUrl';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminReply } = await request.json();

    if (!adminReply || adminReply.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Nội dung phản hồi không được để trống" },
        { status: 400 }
      );
    }

    if (adminReply.length > 500) {
      return NextResponse.json(
        { success: false, message: "Nội dung phản hồi không được vượt quá 500 ký tự" },
        { status: 400 }
      );
    }

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Clean base URL to prevent duplicate /api
    const baseUrl = getBackendBaseUrl();
    const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;

    const response = await fetch(`${cleanBaseUrl}/api/reviews/admin/${id}/reply/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ adminReply })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Có lỗi xảy ra" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error updating admin reply:', error);
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
} 