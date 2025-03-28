import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Chỉ xử lý các API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Lấy path hiện tại
  const path = request.nextUrl.pathname;

  // Kiểm tra nếu đang truy cập API admin
  if (path.startsWith('/api/admin')) {
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    // Nếu không có token, trả về lỗi 401
    if (!token) {
      return NextResponse.json(
        { message: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Token tồn tại, cho phép tiếp tục
    return NextResponse.next();
  }

  // Cho phép các request khác đi qua
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các API routes
export const config = {
  matcher: [
    '/api/:path*', // Bảo vệ tất cả các API routes
  ],
}; 