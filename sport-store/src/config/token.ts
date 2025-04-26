export const TOKEN_CONFIG = {
    ACCESS_TOKEN: {
        COOKIE_NAME: 'access_token',
        STORAGE_KEY: 'access_token',
        HEADER_KEY: 'Authorization',
        PREFIX: 'Bearer',
        EXPIRY: 15 * 60 * 1000, // 15 minutes in milliseconds
    },
    REFRESH_TOKEN: {
        COOKIE_NAME: 'refresh_token',
        STORAGE_KEY: 'refresh_token',
        EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },
    USER: {
        COOKIE_NAME: 'user',
        STORAGE_KEY: 'user',
    },
    COOKIE_OPTIONS: {
        PATH: '/',
        SECURE: process.env.NODE_ENV === 'production',
        SAME_SITE: 'lax' as const,
        HTTP_ONLY: false, // Cho phép JavaScript truy cập để refresh token
    },
} as const;

export const getAuthHeader = (token: string): { Authorization: string } => ({
    Authorization: `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${token}`,
});

export const getCookieOptions = (maxAge?: number): string => {
    const { PATH, SECURE, SAME_SITE } = TOKEN_CONFIG.COOKIE_OPTIONS;
    return `path=${PATH}; ${SECURE ? 'secure;' : ''} samesite=${SAME_SITE}${maxAge ? `; max-age=${maxAge}` : ''}`;
};

export const clearCookie = (name: string): string => {
    return `${name}=; ${getCookieOptions()}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};

// Thêm các hàm tiện ích mới
export const setToken = (token: string, type: 'access' | 'refresh' = 'access'): void => {
    const config = type === 'access' ? TOKEN_CONFIG.ACCESS_TOKEN : TOKEN_CONFIG.REFRESH_TOKEN;
    const expiry = type === 'access' ? TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY : TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY;
    
    // Lưu vào cookie
    document.cookie = `${config.COOKIE_NAME}=${token}; ${getCookieOptions(expiry)}`;
    
    // Lưu vào localStorage
    localStorage.setItem(config.STORAGE_KEY, token);
};

export const getToken = (type: 'access' | 'refresh' = 'access'): string | null => {
    const config = type === 'access' ? TOKEN_CONFIG.ACCESS_TOKEN : TOKEN_CONFIG.REFRESH_TOKEN;
    
    // Thử lấy từ cookie trước
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };
    
    const cookieToken = getCookie(config.COOKIE_NAME);
    if (cookieToken) {
        // Đồng bộ với localStorage
        localStorage.setItem(config.STORAGE_KEY, cookieToken);
        return cookieToken;
    }
    
    // Thử lấy từ localStorage
    const storageToken = localStorage.getItem(config.STORAGE_KEY);
    if (storageToken) {
        // Đồng bộ với cookie
        document.cookie = `${config.COOKIE_NAME}=${storageToken}; ${getCookieOptions()}`;
        return storageToken;
    }
    
    return null;
};

export const clearTokens = (): void => {
    // Xóa cookies
    document.cookie = clearCookie(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
    document.cookie = clearCookie(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
    document.cookie = clearCookie(TOKEN_CONFIG.USER.COOKIE_NAME);
    
    // Xóa localStorage
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
}; 