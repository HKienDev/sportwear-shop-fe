import type { AuthUser } from '@/types/auth';
import type { AppRouter } from '@/types/router';

/**
 * Kiểm tra xem user có phải là admin không
 */
export const isAdmin = (user: AuthUser | null): boolean => {
    if (!user) return false;
    return user.role === 'admin' && user.isActive && user.isVerified;
};

/**
 * Kiểm tra quyền truy cập admin từ API response - optimized for Edge Runtime
 */
export const checkAdminAccess = async (): Promise<boolean> => {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        if (!token) {
            console.log('❌ Không có token');
            return false;
        }

        const response = await fetch('/api/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.log('❌ API check auth thất bại');
            return false;
        }

        const data = await response.json();
        
        if (!data.success || !data.data?.user) {
            console.log('❌ API check auth thất bại hoặc không có user');
            return false;
        }

        const isAdminUser = isAdmin(data.data.user);
        console.log(isAdminUser ? '✅ Admin được phép truy cập' : '❌ Không phải admin');
        return isAdminUser;
    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra quyền admin:', error);
        return false;
    }
};

/**
 * Xử lý chuyển hướng dựa trên quyền admin
 */
export const handleAdminAccess = async (router: AppRouter): Promise<boolean> => {
    const hasAccess = await checkAdminAccess();
    if (!hasAccess) {
        console.log('❌ Không phải admin');
        router.push('/auth/login');
    }
    return hasAccess;
};

export const hasAdminAccess = (user: AuthUser | null): boolean => {
    if (!user) return false;
    return isAdmin(user);
};

export const hasUserAccess = (user: AuthUser | null): boolean => {
    if (!user) return false;
    return user.isActive && user.isVerified;
};

/**
 * Các hàm kiểm tra quyền chỉ dùng cho UI (ẩn/hiện component),
 * không dùng để quyết định redirect hoặc hiển thị lỗi sau login.
 */ 