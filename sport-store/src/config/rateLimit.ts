export const RATE_LIMIT_CONFIG = {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    HEADERS: {
        LIMIT: 'X-RateLimit-Limit',
        REMAINING: 'X-RateLimit-Remaining',
        RESET: 'X-RateLimit-Reset'
    }
} as const; 