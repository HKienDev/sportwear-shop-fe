export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        PRODUCTS: '/admin/products',
        ORDERS: '/admin/orders',
        USERS: '/admin/users',
        CATEGORIES: '/admin/categories',
        SETTINGS: '/admin/settings'
    },
    USER: {
        PROFILE: '/user/profile',
        ORDERS: '/user/orders',
        SETTINGS: '/user/settings'
    },
    PRODUCTS: '/products',
    CART: '/cart',
    CHECKOUT: '/checkout',
    ABOUT: '/about',
    CONTACT: '/contact'
} as const; 