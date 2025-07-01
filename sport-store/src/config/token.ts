export const TOKEN_CONFIG = {
    ACCESS_TOKEN: {
        COOKIE_NAME: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'accessToken',
        STORAGE_KEY: 'access_token',
        HEADER_KEY: 'Authorization',
        PREFIX: 'Bearer',
        EXPIRY: 15 * 60 * 1000, // 15 minutes in milliseconds
    },
    REFRESH_TOKEN: {
        COOKIE_NAME: process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME || 'refreshToken',
        STORAGE_KEY: 'refresh_token',
        EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },
    USER: {
        COOKIE_NAME: 'user',
        STORAGE_KEY: 'user',
    },
    COOKIE_OPTIONS: {
        PATH: '/',
        SECURE: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
        SAME_SITE: (process.env.NEXT_PUBLIC_COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
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

// Xóa toàn bộ logic setToken, getToken, clearTokens liên quan localStorage
