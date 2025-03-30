import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy path hiện tại
  const path = request.nextUrl.pathname;

  // Xử lý chuyển hướng cho auth routes
  if (path.startsWith('/user/auth')) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = path.replace('/user/auth', '/auth');
    return NextResponse.redirect(newUrl);
  }

  // Chỉ xử lý các API routes
  if (!path.startsWith('/api')) {
    return NextResponse.next();
  }

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

// Áp dụng middleware cho các routes cần xử lý
export const config = {
  matcher: [
    '/api/:path*', // Bảo vệ tất cả các API routes
    '/user/auth/:path*', // Xử lý chuyển hướng cho auth routes
  ],
}; 