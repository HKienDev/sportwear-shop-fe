import type { AuthResponseData } from '@/types/auth';

export const setAuthData = (data: AuthResponseData) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
}; 