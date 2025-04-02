export const AUTH_CONFIG = {
    PUBLIC_ROUTES: [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify',
        '/auth/verify-otp',
        '/auth/resend-otp',
        '/',
        '/products',
        '/categories',
        '/about',
        '/contact'
    ] as const,
    USER_KEY: 'user'
} as const; 