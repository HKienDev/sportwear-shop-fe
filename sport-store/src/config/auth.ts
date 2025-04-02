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
        '/contact',
        '/api/products',
        '/api/categories',
        '/api/auth'
    ] as const,
    PROTECTED_ROUTES: [
        '/admin',
        '/profile',
        '/cart',
        '/checkout',
        '/orders',
        '/settings'
    ] as const,
    USER_KEY: 'user'
} as const; 