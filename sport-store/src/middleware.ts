import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.accessToken) {
      return data.accessToken;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
  return null;
};

const getUserRole = async (token: string): Promise<string | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (response.status === 401) {
      // Token hết hạn, thử refresh token
      const newToken = await refreshToken();
      if (!newToken) {
        console.error("Token refresh failed.");
        return null;
      }

      // Gọi lại API với token mới
      const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/check`, {
        method: "GET",
        headers: { Authorization: `Bearer ${newToken}` },
        credentials: "include",
      });

      if (!retryResponse.ok) {
        console.error("Retry failed after token refresh. Response status:", retryResponse.status);
        return null;
      }

      const retryData = await retryResponse.json();
      console.log("Retry response data from /auth/check:", retryData);

      if (retryData.user?.role && typeof retryData.user.role === "string") {
        return retryData.user.role;
      } else {
        console.error("Invalid or missing role in retry response:", retryData);
        return null;
      }
    }

    if (!response.ok) {
      console.error("Failed to fetch user role. Response status:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("Response data from /auth/check:", data);

    if (data.user?.role && typeof data.user.role === "string") {
      return data.user.role;
    } else {
      console.error("Invalid or missing role in response:", data);
      return null;
    }
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
};

export async function middleware(request: NextRequest) {
  // Bỏ qua các route không cần xác thực
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/images') ||
    request.nextUrl.pathname === '/auth/login' ||
    request.nextUrl.pathname === '/auth/register' ||
    request.nextUrl.pathname === '/auth/forgot-password' ||
    request.nextUrl.pathname === '/auth/reset-password'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('accessToken')?.value;

  // Nếu không có token và đang ở trang login, cho phép truy cập
  if (!token && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.next();
  }

  // Nếu không có token, chuyển hướng về trang login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Kiểm tra token và role
  const isValid = await verifyToken(token);
  if (!isValid) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = await getUserRole(token);
  console.log("User role in middleware:", userRole);

  // Kiểm tra quyền truy cập admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};