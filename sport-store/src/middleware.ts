import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/utils/roleUtils';
import { AUTH_CONFIG } from '@/config/auth';
import { TOKEN_CONFIG } from '@/config/token';
import { RATE_LIMIT_CONFIG } from '@/config/rateLimit';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log('🔒 Middleware - Processing request:', pathname);
    
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
        console.log('🔍 Middleware - Not found route detected, redirecting to not-found');
        return NextResponse.redirect(new URL('/error-pages/not-found', request.url));
    }
    
    if (serverErrorRoutes.includes(pathname)) {
        console.log('🔍 Middleware - Server error route detected, redirecting to server-error');
        return NextResponse.redirect(new URL('/error-pages/server-error', request.url));
    }
    
    if (unauthorizedRoutes.includes(pathname)) {
        console.log('🔍 Middleware - Unauthorized route detected, redirecting to unauthorized');
        return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
    }
    
    // Kiểm tra nếu là public route
    const isPublicRoute = AUTH_CONFIG.PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
        console.log('🔓 Middleware - Public route, skipping auth check');
        return NextResponse.next();
    }

    // Lấy token từ cookie
    const accessToken = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    const userCookie = request.cookies.get(TOKEN_CONFIG.USER.COOKIE_NAME)?.value;
    console.log('🔑 Middleware - Access token present:', !!accessToken);
    console.log("👤 Middleware - User cookie present:", !!userCookie);
    console.log('🔍 Middleware - Cookie names:', Array.from(request.cookies.getAll()).map(cookie => cookie.name));

    // Kiểm tra các route cần auth
    if (pathname.startsWith('/admin')) {
        if (!accessToken || !userCookie) {
            console.log("❌ Middleware - No access token or user cookie found, redirecting to login");
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        try {
            // Decode user cookie
            const decodedUserCookie = decodeURIComponent(userCookie);
            console.log('🔍 Middleware - Decoded user cookie:', decodedUserCookie.substring(0, 100) + '...');
            
            const user = JSON.parse(decodedUserCookie);
            
            console.log('👤 Middleware - User data:', {
                role: user.role,
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                authStatus: user.authStatus
            });
            
            if (user.role !== 'admin') {
                console.log("❌ Middleware - User is not admin, redirecting to unauthorized");
                return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
            }

            // Kiểm tra trạng thái xác thực
            if (user.authStatus !== 'verified') {
                console.log('❌ Middleware - User not verified, redirecting to login');
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            // Kiểm tra quyền admin cho các route admin
            console.log('🔍 Middleware - Checking admin access for path:', pathname);
            const hasAdmin = hasAdminAccess(user);
            console.log('👑 Middleware - Has admin access:', hasAdmin);
            
            if (!hasAdmin) {
                console.log('❌ Middleware - No admin access, redirecting to unauthorized');
                return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
            }

            // Nếu là admin và đang ở trang admin, cho phép tiếp tục
            console.log('✅ Middleware - Admin access granted');
            const response = NextResponse.next();
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());
            return response;
        } catch (error) {
            console.log("❌ Middleware - Error parsing user cookie:", error);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // Kiểm tra các route cần đăng nhập (bao gồm /user)
    if (pathname.startsWith('/user') || pathname.startsWith('/profile') || pathname.startsWith('/orders')) {
        console.log('🔍 Middleware - Checking auth for protected route:', pathname);
        
        // Kiểm tra nếu có access token và user cookie
        if (accessToken && userCookie) {
            try {
                // Decode user cookie
                const decodedUserCookie = decodeURIComponent(userCookie);
                const user = JSON.parse(decodedUserCookie);
                
                // Kiểm tra trạng thái xác thực
                if (user.authStatus !== 'verified') {
                    console.log('❌ Middleware - User not verified, redirecting to login');
                    return NextResponse.redirect(new URL('/auth/login', request.url));
                }

                console.log('✅ Middleware - User authenticated for protected route');
                const response = NextResponse.next();
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());
                return response;
            } catch (error) {
                console.log("❌ Middleware - Error parsing user cookie for protected route:", error);
                // Nếu có lỗi parse cookie, xóa cookies và cho phép truy cập như khách vãng lai
                const response = NextResponse.next();
                response.cookies.delete(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
                response.cookies.delete(TOKEN_CONFIG.USER.COOKIE_NAME);
                response.cookies.delete(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
                return response;
            }
        } else {
            // Không có token hoặc user cookie - cho phép truy cập như khách vãng lai
            console.log('👥 Middleware - No auth tokens found, allowing access as guest');
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