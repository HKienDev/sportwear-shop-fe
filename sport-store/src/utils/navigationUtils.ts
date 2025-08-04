import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AuthUser } from '@/types/auth';
import { debounce } from 'lodash';

// Định nghĩa enum UserRole
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

// Thời gian chờ chuyển hướng (ms)
const REDIRECT_DELAY = 100;

// Trạng thái chuyển hướng
let isRedirecting = false;

// Export để kiểm tra từ bên ngoài
export const getJustLoggedOut = () => {
    const justLoggedOut = localStorage.getItem('justLoggedOut') === 'true';
    return justLoggedOut;
};

// Debounced version của handleRedirect
export const handleRedirect = debounce(async (
    router: AppRouterInstance,
    user: AuthUser | null,
    currentPath: string
): Promise<void> => {
    try {
        // Kiểm tra user data thực tế từ localStorage
        const actualUserData = localStorage.getItem('user');
        const hasActualUser = actualUserData && actualUserData !== 'null';
        
        // Nếu vừa logout, không redirect
        if (getJustLoggedOut()) {
            console.log('[handleRedirect] 🚫 Just logged out, skipping redirect');
            return;
        }
        
        // Nếu không có user thực tế trong localStorage, không redirect
        if (!hasActualUser) {
            console.log('[handleRedirect] 🚫 No actual user data, skipping redirect');
            return;
        }
        
        if (isRedirecting) {
            return;
        }
        if (!router) {
            console.warn('[handleRedirect] ⚠️ Router không khả dụng, không thể chuyển hướng');
            return;
        }
        isRedirecting = true;
        let redirectPath = '/';
        
        if (user) {
            if (user.role === UserRole.ADMIN) {
                redirectPath = '/admin/dashboard';
            } else {
                // Chỉ redirect về /user nếu không phải vừa logout và đang ở trang khác
                if (!getJustLoggedOut() && currentPath !== '/user') {
                    redirectPath = '/user';
                } else {
                    // Nếu vừa logout hoặc đang ở /user, không redirect
                    isRedirecting = false;
                    return;
                }
            }
        } else {
            // Nếu không có user và đang ở trang auth, không redirect
            if (currentPath.startsWith('/auth/')) {
                isRedirecting = false;
                return;
            }
            
            // Chỉ redirect admin routes khi không có user
            // Cho phép khách vãng lai truy cập /user và các trang user khác
            if (currentPath.startsWith('/admin/')) {
                redirectPath = '/auth/login';
            }
            // Không redirect khỏi /user routes cho khách vãng lai
        }
        
        console.log('[handleRedirect] 🔄 Redirecting to:', redirectPath);
        await router.replace(redirectPath);
        await new Promise(resolve => setTimeout(resolve, REDIRECT_DELAY));
        isRedirecting = false;
    } catch (error) {
        console.error('[handleRedirect] ❌ Lỗi khi chuyển hướng:', error);
        isRedirecting = false;
        throw error;
    }
}, 100);

// Function để set flag logout và cancel debounce
export const setJustLoggedOut = () => {
    localStorage.setItem('justLoggedOut', 'true');
    // Cancel debounce
    handleRedirect.cancel();
    // Reset flag sau 2 giây
    setTimeout(() => {
        localStorage.removeItem('justLoggedOut');
    }, 2000);
};

// Function để clear flag khi login thành công
export const clearJustLoggedOut = () => {
    localStorage.removeItem('justLoggedOut');
}; 