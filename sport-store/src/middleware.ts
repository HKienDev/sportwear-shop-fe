import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/utils/roleUtils';
import { AUTH_CONFIG } from '@/config/auth';
import { TOKEN_CONFIG } from '@/config/token';
import { RATE_LIMIT_CONFIG } from '@/config/rateLimit';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Handle invalid/error routes - redirect to appropriate error pages
    const notFoundRoutes = [
        '/search',
        '/invalid',
        '/broken',
        '/error',
        '/404',
        '/not-found',
        '/page-not-found'
    ];
    
    const serverErrorRoutes = [
        '/500',
        '/server-error',
        '/internal-error'
    ];
    
    const unauthorizedRoutes = [
        '/401',
        '/unauthorized',
        '/access-denied',
        '/forbidden',
        '/403'
    ];
    
    if (notFoundRoutes.includes(pathname) || pathname.startsWith('/search/')) {
        return NextResponse.redirect(new URL('/error-pages/not-found', request.url));
    }
    
    if (serverErrorRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/error-pages/server-error', request.url));
    }
    
    if (unauthorizedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
    }
    
    // Kiểm tra nếu là public route
    const isPublicRoute = AUTH_CONFIG.PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Lấy token từ cookie
    const accessToken = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    const userCookie = request.cookies.get(TOKEN_CONFIG.USER.COOKIE_NAME)?.value;

    // Kiểm tra các route cần auth
    if (pathname.startsWith('/admin')) {
        if (!accessToken || !userCookie) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        try {
            // Decode user cookie
            const decodedUserCookie = decodeURIComponent(userCookie);
            const user = JSON.parse(decodedUserCookie);
            
            if (user.role !== 'admin') {
                return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
            }

            // Kiểm tra trạng thái xác thực
            if (user.authStatus !== 'verified') {
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            // Kiểm tra quyền admin cho các route admin
            const hasAdmin = hasAdminAccess(user);
            
            if (!hasAdmin) {
                return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
            }

            // Nếu là admin và đang ở trang admin, cho phép tiếp tục
            const response = NextResponse.next();
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());
            return response;
        } catch (error) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // Kiểm tra các route cần đăng nhập (bao gồm /user)
    if (pathname.startsWith('/user') || pathname.startsWith('/profile') || pathname.startsWith('/orders')) {
        // Kiểm tra nếu có access token và user cookie
        if (accessToken && userCookie) {
            try {
                // Decode user cookie
                const decodedUserCookie = decodeURIComponent(userCookie);
                const user = JSON.parse(decodedUserCookie);
                
                // Kiểm tra trạng thái xác thực
                if (user.authStatus !== 'verified') {
                    return NextResponse.redirect(new URL('/auth/login', request.url));
                }

                const response = NextResponse.next();
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());
                return response;
            } catch (error) {
                // Nếu có lỗi parse cookie, xóa cookies và cho phép truy cập như khách vãng lai
                const response = NextResponse.next();
                response.cookies.delete(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
                response.cookies.delete(TOKEN_CONFIG.USER.COOKIE_NAME);
                response.cookies.delete(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
                return response;
            }
        } else {
            // Không có token hoặc user cookie - cho phép truy cập như khách vãng lai
            const response = NextResponse.next();
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());
            return response;
        }
    }

    // Thêm headers cho rate limiting
    const response = NextResponse.next();
    response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
    response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
    response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());

    return response;
}

export const config = {
    matcher: [
        '/',
        '/admin/:path*',
        '/profile/:path*',
        '/cart/:path*',
        '/checkout/:path*',
        '/orders/:path*',
        '/settings/:path*',
        '/user/:path*',
        '/search/:path*'
    ]
};