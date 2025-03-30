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
  const path = request.nextUrl.pathname;
  console.log("Middleware executed for path:", path);

  // Các route công khai không cần xác thực
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgotPasswordEmail",
    "/auth/otpVerifyRegister",
  ];

  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Đọc token từ cookie
  const token = request.cookies.get("accessToken")?.value;
  if (!token || !(await verifyToken(token))) {
    const newToken = await refreshToken();
    if (!newToken) {
      console.log("Middleware redirecting to /auth/login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Lưu token mới vào cookie
    const response = NextResponse.next();
    response.cookies.set("accessToken", newToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    });
    return response;
  }

  // Kiểm tra quyền truy cập admin
  const role = await getUserRole(token);
  console.log("User role in middleware:", role);

  // Xử lý chuyển hướng dựa trên role
  if (path === "/") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  // Nếu không phải admin và cố gắng truy cập /admin, chuyển hướng sang /user
  if (role !== "admin" && path.startsWith("/admin")) {
    console.log("Middleware redirecting from /admin to /user");
    return NextResponse.redirect(new URL("/user", request.url));
  }

  // Nếu là admin và cố gắng truy cập /user, chuyển hướng sang /admin
  if (role === "admin" && path.startsWith("/user")) {
    console.log("Middleware redirecting from /user to /admin");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};