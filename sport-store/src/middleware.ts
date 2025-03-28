import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy token từ cookie
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Lấy path hiện tại
  const path = request.nextUrl.pathname;

  // Kiểm tra nếu đang truy cập trang admin
  if (path.startsWith('/admin')) {
    // Nếu không có token, chuyển hướng về trang login
    if (!accessToken) {
      // Tạo URL tuyệt đối cho trang login
      const baseUrl = request.nextUrl.origin;
      const loginUrl = new URL('/user/auth/login', baseUrl);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }

    // Token tồn tại, cho phép tiếp tục
    return NextResponse.next();
  }

  // Cho phép các request khác đi qua
  return NextResponse.next();
}

// Chỉ áp dụng middleware cho các route cần bảo vệ
export const config = {
  matcher: [
    '/admin/:path*', // Bảo vệ tất cả các route bắt đầu bằng /admin
  ],
}; 