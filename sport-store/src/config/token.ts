export const TOKEN_CONFIG = {
    ACCESS_TOKEN: {
        COOKIE_NAME: 'access_token',
        STORAGE_KEY: 'access_token',
        HEADER_KEY: 'Authorization',
        PREFIX: 'Bearer',
        EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
    },
    REFRESH_TOKEN: {
        COOKIE_NAME: 'refresh_token',
        STORAGE_KEY: 'refresh_token',
        EXPIRY: 30 * 24 * 60 * 60, // 30 days in seconds
    },
    USER: {
        COOKIE_NAME: 'user',
        STORAGE_KEY: 'user',
    },
    COOKIE_OPTIONS: {
        PATH: '/',
        SECURE: process.env.NODE_ENV === 'production',
        SAME_SITE: 'lax' as const,
        HTTP_ONLY: true,
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