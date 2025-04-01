import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/config/constants';
import { TOKEN_CONFIG } from '@/config/token';
import { hasAdminAccess } from '@/utils/roleUtils';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname as (typeof AUTH_CONFIG.IGNORED_ROUTES)[number];

    // Bỏ qua các route không cần check
    if (AUTH_CONFIG.IGNORED_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    try {
        // Lấy token từ cookie
        const accessToken = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
        const userCookie = request.cookies.get(TOKEN_CONFIG.USER.COOKIE_NAME)?.value;

        // Nếu không có token hoặc user data, chuyển hướng về trang login
        if (!accessToken || !userCookie) {
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
            response.cookies.delete(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
            response.cookies.delete(TOKEN_CONFIG.USER.COOKIE_NAME);
            return response;
        }

        // Parse user data
        let user;
        try {
            const decodedUserCookie = decodeURIComponent(userCookie);
            user = JSON.parse(decodedUserCookie);
        } catch (error) {
            console.error('❌ Lỗi khi parse user data:', error);
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
            response.cookies.delete(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
            response.cookies.delete(TOKEN_CONFIG.USER.COOKIE_NAME);
            return response;
        }

        // Kiểm tra quyền admin
        if (pathname.startsWith('/admin') && !hasAdminAccess(user)) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Thêm headers cho rate limiting
        const response = NextResponse.next();
        response.headers.set('x-rate-limit', '100');
        response.headers.set('x-rate-limit-remaining', '99');
        response.headers.set('x-rate-limit-reset', '3600');

        return response;
    } catch (error) {
        console.error('❌ Lỗi trong middleware:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
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