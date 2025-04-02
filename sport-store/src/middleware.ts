import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/utils/roleUtils';
import { AUTH_CONFIG } from '@/config/auth';
import { TOKEN_CONFIG } from '@/config/token';
import { RATE_LIMIT_CONFIG } from '@/config/rateLimit';
import { AuthStatus } from '@/types/base';
import type { AuthUser } from '@/types/auth';
import { UserRole } from '@/types/base';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    console.log('🔒 Middleware - Processing request:', pathname);
    
    // Kiểm tra nếu là public route
    const isPublicRoute = AUTH_CONFIG.PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
        console.log('🔓 Middleware - Public route, skipping auth check');
        return NextResponse.next();
    }

    // Lấy access token từ cookie
    const accessToken = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    console.log('🔑 Middleware - Access token present:', !!accessToken);

    // Kiểm tra user cookie
    const userCookie = request.cookies.get("user");
    if (userCookie) {
        console.log("👤 Middleware - User cookie present: true");
        try {
            const userData = JSON.parse(decodeURIComponent(userCookie.value)) as AuthUser;
            console.log("📦 Middleware - Parsed user data:", userData);
            
            // Validate required fields
            if (!userData._id || !userData.email || !userData.role) {
                console.log("❌ Middleware - Invalid user data structure:", userData);
                return NextResponse.redirect(new URL("/auth/login", request.url));
            }

            // Kiểm tra role cho admin routes
            if (pathname.startsWith("/admin") && userData.role !== UserRole.ADMIN) {
                console.log("❌ Middleware - User is not admin");
                return NextResponse.redirect(new URL("/", request.url));
            }

            // Kiểm tra role cho user routes
            if (pathname.startsWith("/user") && userData.role !== UserRole.USER) {
                console.log("❌ Middleware - User is not regular user");
                return NextResponse.redirect(new URL("/", request.url));
            }

            // Kiểm tra trạng thái xác thực
            if (userData.authStatus !== AuthStatus.VERIFIED) {
                console.log('❌ Middleware - User not verified, redirecting to login');
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            // Kiểm tra quyền admin cho các route admin
            if (pathname.startsWith('/admin')) {
                console.log('🔍 Middleware - Checking admin access for path:', pathname);
                const hasAdmin = hasAdminAccess(userData);
                console.log('👑 Middleware - Has admin access:', hasAdmin);
                
                if (!hasAdmin) {
                    console.log('❌ Middleware - No admin access, redirecting to home');
                    return NextResponse.redirect(new URL('/', request.url));
                }

                // Nếu là admin và đang ở trang admin, cho phép tiếp tục
                console.log('✅ Middleware - Admin access granted');
                const response = NextResponse.next();
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
                response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());
                return response;
            }

            // Thêm headers cho rate limiting
            const response = NextResponse.next();
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
            response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());

            return response;
        } catch (error) {
            console.log("❌ Middleware - Error parsing user cookie:", error);
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    } else {
        console.log("❌ Middleware - No user cookie found");
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
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
        '/user/:path*'
    ]
};