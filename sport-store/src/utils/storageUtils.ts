import { TOKEN_CONFIG } from '@/config/token';
import type { AuthUser } from '@/types/auth';

export const setStorageItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error('❌ Lỗi khi lưu vào localStorage:', error);
    }
};

export const getStorageItem = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('❌ Lỗi khi đọc từ localStorage:', error);
        return null;
    }
};

export const removeStorageItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('❌ Lỗi khi xóa từ localStorage:', error);
    }
};

export const setAuthStorage = (accessToken: string, refreshToken: string, user: AuthUser): void => {
    setStorageItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
    setStorageItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, refreshToken);
    setStorageItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(user));
};

export const clearAuthStorage = (): void => {
    removeStorageItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    removeStorageItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
    removeStorageItem(TOKEN_CONFIG.USER.STORAGE_KEY);
};

export const getAuthData = (): { accessToken: string | null; refreshToken: string | null; user: AuthUser | null } => {
    const accessToken = getStorageItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    const refreshToken = getStorageItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
    const userStr = getStorageItem(TOKEN_CONFIG.USER.STORAGE_KEY);
    
    let user: AuthUser | null = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr) as AuthUser;
        } catch (error) {
            console.error('❌ Lỗi khi parse user data:', error);
        }
    }
    
    return { accessToken, refreshToken, user };
}; 