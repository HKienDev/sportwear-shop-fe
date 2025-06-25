import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AuthUser } from '@/types/auth';
import { debounce } from 'lodash';

// Định nghĩa enum UserRole
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

// Thời gian chờ chuyển hướng (ms)
const REDIRECT_DELAY = 300;

// Trạng thái chuyển hướng
let isRedirecting = false;
let justLoggedOut = false;

// Export để kiểm tra từ bên ngoài
export const getJustLoggedOut = () => justLoggedOut;

// Debounced version của handleRedirect
export const handleRedirect = debounce(async (
    router: AppRouterInstance,
    user: AuthUser | null,
    currentPath: string
): Promise<void> => {
    try {
        console.log('[handleRedirect] 🔍 Debug:', { 
            hasUser: !!user, 
            userRole: user?.role, 
            currentPath, 
            justLoggedOut 
        });
        
        // Thêm stack trace để debug
        console.log('[handleRedirect] 📍 Stack trace:', new Error().stack?.split('\n').slice(1, 4).join('\n'));
        
        // Nếu vừa logout, không redirect
        if (justLoggedOut) {
            console.log('[handleRedirect] 🔒 Vừa logout, không redirect');
            return;
        }
        
        if (isRedirecting) {
            console.log('[handleRedirect] ⚠️ Đang trong quá trình chuyển hướng, bỏ qua');
            return;
        }
        if (!router) {
            console.warn('[handleRedirect] ⚠️ Router không khả dụng, không thể chuyển hướng');
            return;
        }
        isRedirecting = true;
        let redirectPath = '/';
        let reason = '';
        
        if (user) {
            if (user.role === UserRole.ADMIN) {
                redirectPath = '/admin/dashboard';
                reason = 'role=admin';
            } else {
                redirectPath = '/user';
                reason = 'role=user';
            }
            
            // Nếu đang ở trang auth và có user, cho phép redirect
            if (currentPath.startsWith('/auth/')) {
                console.log('[handleRedirect] 🔄 Redirect từ trang auth sau khi đăng nhập thành công');
            }
        } else {
            // Nếu không có user và đang ở trang auth, không redirect
            if (currentPath.startsWith('/auth/')) {
                console.log('[handleRedirect] 🔒 Đang ở trang auth, không có user, không redirect');
                isRedirecting = false;
                return;
            }
            
            // Nếu không có user và đang ở trang protected, redirect về login
            if (currentPath.startsWith('/admin/') || currentPath.startsWith('/user/')) {
                redirectPath = '/auth/login';
                reason = 'no user, cần xác thực';
            }
        }
        
        console.log('[handleRedirect] 🔄 Thực hiện chuyển hướng:', { from: currentPath, to: redirectPath, reason });
        await router.push(redirectPath);
        await new Promise(resolve => setTimeout(resolve, REDIRECT_DELAY));
        isRedirecting = false;
    } catch (error) {
        console.error('[handleRedirect] ❌ Lỗi khi chuyển hướng:', error);
        isRedirecting = false;
        throw error;
    }
}, 500);

// Function để set flag logout và cancel debounce
export const setJustLoggedOut = () => {
    console.log('[setJustLoggedOut] 🔒 Setting justLoggedOut flag to true');
    justLoggedOut = true;
    // Cancel debounce
    handleRedirect.cancel();
    console.log('[setJustLoggedOut] ✅ Cancelled handleRedirect debounce');
    // Reset flag sau 2 giây
    setTimeout(() => {
        justLoggedOut = false;
        console.log('[setJustLoggedOut] 🔄 Reset justLoggedOut flag to false');
    }, 2000);
}; 