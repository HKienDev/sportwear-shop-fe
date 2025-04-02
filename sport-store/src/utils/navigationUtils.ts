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

// Debounced version của handleRedirect
export const handleRedirect = debounce(async (
    router: AppRouterInstance,
    user: AuthUser | null,
    currentPath: string
): Promise<void> => {
    try {
        // Nếu đang chuyển hướng, không thực hiện thêm
        if (isRedirecting) {
            console.log('⚠️ Đang trong quá trình chuyển hướng, bỏ qua');
            return;
        }

        // Nếu không có router, không thực hiện chuyển hướng
        if (!router) {
            console.warn('⚠️ Router không khả dụng, không thể chuyển hướng');
            return;
        }

        // Đánh dấu đang chuyển hướng
        isRedirecting = true;

        // Xác định đường dẫn chuyển hướng
        let redirectPath = '/';

        // Nếu có user, xử lý chuyển hướng dựa trên role
        if (user) {
            console.log('👤 Xử lý chuyển hướng cho user:', {
                role: user.role,
                currentPath
            });

            // Xác định đường dẫn chuyển hướng dựa trên role
            if (user.role === UserRole.ADMIN) {
                redirectPath = '/admin/dashboard';
            } else {
                redirectPath = '/user/';
            }

            // Nếu đang ở trang auth, thực hiện chuyển hướng
            if (currentPath.startsWith('/auth/')) {
                // Nếu đường dẫn chuyển hướng giống với đường dẫn hiện tại, không thực hiện chuyển hướng
                if (redirectPath === currentPath) {
                    console.log('⚠️ Đường dẫn chuyển hướng giống với đường dẫn hiện tại, bỏ qua');
                    isRedirecting = false;
                    return;
                }
            }
        } else {
            // Nếu không có user và đang ở trang cần xác thực
            if (currentPath.startsWith('/admin/') || currentPath.startsWith('/user/')) {
                redirectPath = '/auth/login';
            }
        }

        // Log thông tin chuyển hướng
        console.log('🔄 Thực hiện chuyển hướng:', {
            from: currentPath,
            to: redirectPath,
            hasUser: !!user,
            userRole: user?.role
        });

        // Thực hiện chuyển hướng với router.push
        await router.push(redirectPath);

        // Đợi một chút để đảm bảo chuyển hướng hoàn tất
        await new Promise(resolve => setTimeout(resolve, REDIRECT_DELAY));

        // Reset trạng thái chuyển hướng
        isRedirecting = false;
    } catch (error) {
        console.error('❌ Lỗi khi chuyển hướng:', error);
        isRedirecting = false;
        throw error;
    }
}, 500); 