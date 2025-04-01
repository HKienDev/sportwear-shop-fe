import { AUTH_CONFIG } from '@/config/constants';

let lastCheckTime = 0;
let isChecking = false;

export const canCheckAuth = (): boolean => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime;
    
    // Nếu đang trong quá trình check hoặc chưa đủ thời gian cooldown
    if (isChecking || timeSinceLastCheck < AUTH_CONFIG.REDIRECT_COOLDOWN) {
        return false;
    }
    
    return true;
};

export const startAuthCheck = (): void => {
    isChecking = true;
    lastCheckTime = Date.now();
};

export const endAuthCheck = (): void => {
    isChecking = false;
};

export const resetAuthCheck = (): void => {
    lastCheckTime = 0;
    isChecking = false;
}; 