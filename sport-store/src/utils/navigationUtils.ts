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
    console.log('[getJustLoggedOut] 🔍 Checking justLoggedOut flag:', justLoggedOut);
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
            console.log('[handleRedirect] 🔒 Just logged out, skipping redirect');
            return;
        }
        
        // Nếu không có user thực tế trong localStorage, không redirect
        if (!hasActualUser) {
            console.log('[handleRedirect] ❌ No actual user data in localStorage');
            return;
        }
        
        if (isRedirecting) {
            console.log('[handleRedirect] ⏳ Already redirecting, skipping');
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
                redirectPath = '/user';
            }
        } else {
            // Nếu không có user và đang ở trang auth, không redirect
            if (currentPath.startsWith('/auth/')) {
                isRedirecting = false;
                return;
            }
            
            // Nếu không có user và đang ở trang protected, redirect về login
            if (currentPath.startsWith('/admin/') || currentPath.startsWith('/user/')) {
                redirectPath = '/auth/login';
            }
        }
        
        console.log(`[handleRedirect] 🔄 Redirecting to: ${redirectPath}`);
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
    console.log('[setJustLoggedOut] 🔒 Setting justLoggedOut flag to true');
    localStorage.setItem('justLoggedOut', 'true');
    // Cancel debounce
    handleRedirect.cancel();
    console.log('[setJustLoggedOut] ✅ Cancelled handleRedirect debounce');
    // Reset flag sau 2 giây
    setTimeout(() => {
        localStorage.removeItem('justLoggedOut');
        console.log('[setJustLoggedOut] 🔄 Reset justLoggedOut flag to false');
    }, 2000);
};

// Function để clear flag khi login thành công
export const clearJustLoggedOut = () => {
    console.log('[clearJustLoggedOut] 🧹 Clearing justLoggedOut flag');
    localStorage.removeItem('justLoggedOut');
    console.log('[clearJustLoggedOut] ✅ JustLoggedOut flag cleared');
}; 