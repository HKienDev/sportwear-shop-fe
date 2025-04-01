import { ROUTES } from '@/config/constants';
import type { User } from '@/types/base';
import type { AppRouter } from '@/types/router';

let isRedirecting = false;
let lastRedirectTime = 0;
const REDIRECT_COOLDOWN = 2000; // 2 giây

export const handleRedirect = async (
    router: AppRouter,
    user: User | null,
    currentPath: string,
    from?: string
) => {
    const now = Date.now();
    if (isRedirecting || (now - lastRedirectTime) < REDIRECT_COOLDOWN) {
        console.log('🔄 Already redirecting or in cooldown, skipping...');
        return;
    }

    try {
        isRedirecting = true;
        lastRedirectTime = now;

        console.log('🔄 Handling redirect:', { user, currentPath, from });

        // Nếu đang ở trang login hoặc register
        if (currentPath === '/auth/login' || currentPath === '/auth/register') {
            if (user) {
                // Nếu đã đăng nhập, chuyển hướng dựa vào role
                const redirectPath = from || (user.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME);
                console.log('🔄 Redirecting to:', redirectPath);
                
                // Đợi chuyển hướng hoàn thành
                await new Promise(resolve => setTimeout(resolve, 100));
                await router.replace(redirectPath);
            }
        } else {
            // Nếu không đang ở trang login/register
            if (!user) {
                // Nếu chưa đăng nhập, chuyển về login
                console.log('🔄 No user, redirecting to login');
                const redirectUrl = new URL(ROUTES.LOGIN, window.location.origin);
                // Chỉ thêm from param nếu currentPath không phải là login hoặc register
                if (!currentPath.includes('/auth/')) {
                    redirectUrl.searchParams.set('from', currentPath);
                }
                await router.replace(redirectUrl.toString());
            } else if (user.role === 'admin' && !currentPath.startsWith('/admin')) {
                // Nếu là admin nhưng không ở trang admin
                console.log('🔄 Admin user, redirecting to dashboard');
                await router.replace(ROUTES.ADMIN.DASHBOARD);
            } else if (user.role !== 'admin' && currentPath.startsWith('/admin')) {
                // Nếu không phải admin nhưng đang ở trang admin
                console.log('🔄 Non-admin user, redirecting to home');
                await router.replace(ROUTES.HOME);
            }
        }
    } finally {
        isRedirecting = false;
    }
}; 