import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/utils/roleUtils';
import { AUTH_CONFIG } from '@/config/auth';
import { TOKEN_CONFIG } from '@/config/token';
import { RATE_LIMIT_CONFIG } from '@/config/rateLimit';
import { AuthStatus } from '@/types/base';
import { UserRole } from '@/types/base';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log('🔒 Middleware - Processing request:', pathname);
    
    // Handle 404 routes - redirect to not-found page
    if (pathname === '/search' || pathname.startsWith('/search/')) {
        console.log('🔍 Middleware - Search route detected, redirecting to not-found');
        return NextResponse.redirect(new URL('/error-pages/not-found', request.url));
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

    // Kiểm tra các route cần auth
    if (pathname.startsWith('/admin')) {
        if (!accessToken || !userCookie) {
            console.log("❌ Middleware - No access token or user cookie found, redirecting to login");
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        try {
            // Decode user cookie
            const decodedUserCookie = decodeURIComponent(userCookie);
            const user = JSON.parse(decodedUserCookie);
            
            console.log('👤 Middleware - User role:', user.role);
            
            if (user.role !== UserRole.ADMIN) {
                console.log("❌ Middleware - User is not admin, redirecting to unauthorized");
                return NextResponse.redirect(new URL('/error-pages/unauthorized', request.url));
            }

            // Kiểm tra trạng thái xác thực
            if (user.authStatus !== AuthStatus.VERIFIED) {
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
        
        if (!accessToken || !userCookie) {
            console.log("❌ Middleware - No access token or user cookie found, redirecting to login");
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        try {
            // Decode user cookie
            const decodedUserCookie = decodeURIComponent(userCookie);
            const user = JSON.parse(decodedUserCookie);
            
            // Kiểm tra trạng thái xác thực
            if (user.authStatus !== AuthStatus.VERIFIED) {
                console.log('❌ Middleware - User not verified, redirecting to login');
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            console.log('✅ Middleware - User authenticated for protected route');
        } catch (error) {
            console.log("❌ Middleware - Error parsing user cookie for protected route:", error);
            return NextResponse.redirect(new URL('/auth/login', request.url));
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