import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/utils/roleUtils';
import { AUTH_CONFIG } from '@/config/auth';
import { TOKEN_CONFIG } from '@/config/token';
import { RATE_LIMIT_CONFIG } from '@/config/rateLimit';
import { AuthStatus } from '@/types/base';
import { UserRole } from '@/types/base';

export async function middleware(request: NextRequest) {
    console.log('🔒 Middleware - Processing request:', request.nextUrl.pathname);
    
    // Bỏ qua các route không cần xác thực
    if (AUTH_CONFIG.PUBLIC_ROUTES.some((route: string) => request.nextUrl.pathname.startsWith(route))) {
        console.log('🔓 Middleware - Public route, skipping auth check');
        return NextResponse.next();
    }

    // Lấy access token từ cookie
    const accessToken = request.cookies.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    console.log('🔑 Middleware - Access token present:', !!accessToken);

    // Lấy user data từ cookie
    const userCookie = request.cookies.get(TOKEN_CONFIG.USER.COOKIE_NAME)?.value;
    console.log('👤 Middleware - User cookie present:', !!userCookie);

    // Kiểm tra xác thực
    if (!accessToken || !userCookie) {
        console.log('❌ Middleware - Missing auth data, redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Parse user data từ cookie
        const userData = JSON.parse(decodeURIComponent(userCookie));
        console.log('📦 Middleware - Parsed user data:', {
            id: userData._id,
            email: userData.email,
            role: userData.role,
            authStatus: userData.authStatus
        });

        // Kiểm tra trạng thái xác thực
        if (userData.authStatus !== AuthStatus.VERIFIED) {
            console.log('❌ Middleware - User not verified, redirecting to login');
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Xử lý chuyển hướng cho trang chủ
        if (request.nextUrl.pathname === '/') {
            console.log('🏠 Middleware - Handling root path redirect');
            if (userData.role === UserRole.ADMIN) {
                console.log('👑 Middleware - Admin user, redirecting to dashboard');
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
                console.log('👤 Middleware - Regular user, redirecting to user page');
                return NextResponse.redirect(new URL('/user', request.url));
            }
        }

        // Kiểm tra quyền admin cho các route admin
        if (request.nextUrl.pathname.startsWith('/admin')) {
            console.log('🔍 Middleware - Checking admin access for path:', request.nextUrl.pathname);
            const hasAdmin = hasAdminAccess(userData);
            console.log('👑 Middleware - Has admin access:', hasAdmin);
            
            if (!hasAdmin) {
                console.log('❌ Middleware - No admin access, redirecting to home');
                return NextResponse.redirect(new URL('/', request.url));
            }
        }

        // Thêm headers cho rate limiting
        const response = NextResponse.next();
        response.headers.set(RATE_LIMIT_CONFIG.HEADERS.LIMIT, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
        response.headers.set(RATE_LIMIT_CONFIG.HEADERS.REMAINING, RATE_LIMIT_CONFIG.MAX_REQUESTS.toString());
        response.headers.set(RATE_LIMIT_CONFIG.HEADERS.RESET, (Date.now() + RATE_LIMIT_CONFIG.WINDOW_MS).toString());

        return response;
    } catch (error) {
        console.error('❌ Middleware - Error processing request:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
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