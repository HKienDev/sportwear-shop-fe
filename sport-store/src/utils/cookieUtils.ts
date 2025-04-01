import { TOKEN_CONFIG } from '@/config/token';

export const setCookie = (name: string, value: string, maxAge?: number): void => {
    const options = `path=/; secure; samesite=strict${maxAge ? `; max-age=${maxAge}` : ''}`;
    document.cookie = `${name}=${value}; ${options}`;
};

export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
};

export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict;`;
};

export const setAuthCookies = (accessToken: string, refreshToken: string, user: string): void => {
    setCookie(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME, accessToken, TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY);
    setCookie(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME, refreshToken, TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY);
    setCookie(TOKEN_CONFIG.USER.COOKIE_NAME, user);
};

export const clearAuthCookies = (): void => {
    deleteCookie(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
    deleteCookie(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME);
    deleteCookie(TOKEN_CONFIG.USER.COOKIE_NAME);
}; 