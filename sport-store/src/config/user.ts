import { TOKEN_CONFIG } from './token';
import type { AuthUser } from '@/types/auth';

export const setUserData = (user: AuthUser): void => {
    if (!user) return;
    
    try {
        const userJson = JSON.stringify(user);
        
        console.log("🔍 Setting user data:", {
            original: user,
            json: userJson
        });
        
        // Lưu vào localStorage
        localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userJson);
        
        // Lưu vào cookie (không cần encode vì browser sẽ tự handle)
        document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userJson}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY}`;
    } catch (error) {
        console.error("❌ Error setting user data:", error);
    }
};

export const getUserData = (): AuthUser | null => {
    // Thử lấy từ localStorage trước
    const storageUser = localStorage.getItem(TOKEN_CONFIG.USER.STORAGE_KEY);
    console.log("🔍 Getting user data from localStorage:", storageUser);
    
    if (storageUser && storageUser !== 'undefined' && storageUser !== 'null') {
        try {
            const userData = JSON.parse(storageUser);
            if (userData) {
                // Đồng bộ với cookie
                document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${storageUser}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY}`;
                return userData;
            }
        } catch (error) {
            console.error("❌ Error parsing user from storage:", error);
        }
    }
    
    // Nếu không có trong localStorage, thử lấy từ cookie
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };
    
    const cookieUser = getCookie(TOKEN_CONFIG.USER.COOKIE_NAME);
    console.log("🔍 Getting user data from cookie:", cookieUser);
    
    if (cookieUser && cookieUser !== 'undefined' && cookieUser !== 'null') {
        try {
            const userData = JSON.parse(cookieUser);
            if (userData) {
                // Đồng bộ với localStorage
                localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, cookieUser);
                return userData;
            }
        } catch (error) {
            console.error("❌ Error parsing user cookie:", error);
        }
    }
    
    return null;
};

export const clearUserData = (): void => {
    console.log("🗑️ Clearing user data");
    // Xóa cookie
    document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    
    // Xóa localStorage
    localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
}; 