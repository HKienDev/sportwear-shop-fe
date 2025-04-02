export const TOKEN_CONFIG = {
    ACCESS_TOKEN: {
        COOKIE_NAME: 'accessToken',
        STORAGE_KEY: 'token',
        HEADER_KEY: 'Authorization',
        PREFIX: 'Bearer',
        EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
    } as const,
    
    REFRESH_TOKEN: {
        COOKIE_NAME: 'refreshToken',
        STORAGE_KEY: 'refreshToken',
        EXPIRY: 30 * 24 * 60 * 60, // 30 days in seconds
    } as const,
    
    USER: {
        COOKIE_NAME: 'user',
        STORAGE_KEY: 'user',
    } as const,
    
    COOKIE_OPTIONS: {
        PATH: '/',
        SECURE: process.env.NODE_ENV === 'production',
        SAME_SITE: 'lax',
        HTTP_ONLY: true,
    } as const,
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