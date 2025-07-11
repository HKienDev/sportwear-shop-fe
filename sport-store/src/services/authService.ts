import type { 
    VerifyOTPRequest, 
    UpdateProfileRequest,
    GoogleAuthResponse,
    LoginResponse,
    AuthCheckResponse,
    TokenVerifyResponse,
    ProfileResponse,
    EmptyResponse,
    AuthUser
} from '@/types/auth';
import type { ApiResponse } from '@/types/api';
import { isAdmin } from '@/utils/roleUtils';
import { setAuthCookies, clearAuthCookies } from '@/utils/cookieUtils';
import { setAuthStorage, clearAuthStorage } from '@/utils/storageUtils';
import { TOKEN_CONFIG } from '@/config/token';
import type { LoginCredentials, RegisterRequest } from '@/types/auth';
import type { User } from '@/types/base';

interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

const setAuthData = ({ accessToken, refreshToken, user }: AuthData): void => {
    // Set data in both cookies and localStorage
    setAuthCookies(accessToken, refreshToken, JSON.stringify(user));
    setAuthStorage(accessToken, refreshToken, user);
    
    // Log role check
    console.log('🔑 User role:', user.role);
    console.log('👑 Is admin:', isAdmin(user));
};

// Optimized fetch-based API client for auth operations
const authApiClient = {
    async request<T>(url: string, options: RequestInit = {}): Promise<T> {
        const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY) : null;
        let headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (options.headers) {
            if (Array.isArray(options.headers)) {
                headers = Object.fromEntries(options.headers as [string, string][]);
            } else if (options.headers instanceof Headers) {
                headers = Object.fromEntries((options.headers as Headers).entries());
            } else {
                headers = { ...options.headers } as Record<string, string>;
            }
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(url, {
            ...options,
            headers,
        });
        if (!response.ok) {
            if (response.status === 401 && typeof window !== 'undefined') {
                localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
                window.location.href = '/auth/login';
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async get<T>(url: string): Promise<T> {
        return this.request<T>(url, { method: 'GET' });
    },

    async post<T>(url: string, data?: unknown): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async put<T>(url: string, data?: unknown): Promise<T> {
        return this.request<T>(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async patch<T>(url: string, data?: unknown): Promise<T> {
        return this.request<T>(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    async delete<T>(url: string): Promise<T> {
        return this.request<T>(url, { method: 'DELETE' });
    }
};

// Auth service functions
export const authService = {
  // Login
  async login(credentials: LoginCredentials) {
    const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/login', credentials);
    return response;
  },

  // Register
  async register(userData: RegisterRequest) {
    const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/register', userData);
    return response;
  },

  // Logout
  async logout() {
    const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/logout');
    return response;
  },

  // Refresh token
  async refreshToken() {
    const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/refresh-token');
    return response;
  },

  // Get user profile
  async getProfile() {
    const response = await authApiClient.get<ApiResponse<ProfileResponse['data']>>('/api/auth/profile');
    return response;
  },

  // Verify token
  async verifyToken() {
    const response = await authApiClient.get<ApiResponse<TokenVerifyResponse['data']>>('/api/auth/verify-token');
    return response;
  }
};

// Individual exports for backward compatibility
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/login', credentials);
        if (response.success && response.data) {
            const { user, accessToken, refreshToken } = response.data;
            setAuthData({ accessToken, refreshToken, user });
        }
        return response;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/register', userData);
        return response;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logout = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/logout');
        // Clear auth data
        clearAuthCookies();
        clearAuthStorage();
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        // Clear auth data even if API call fails
        clearAuthCookies();
        clearAuthStorage();
        throw error;
    }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/forgot-password', { email });
        return response;
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/reset-password', { token, newPassword });
        return response;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/verify-otp', data);
        return response;
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
};

export const resendOTP = async (data: { email: string }): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/resend-otp', data);
        return response;
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await authApiClient.put<ApiResponse<ProfileResponse['data']>>('/api/auth/profile', data);
        if (response.success && response.data?.user) {
            const { user } = response.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
        }
        return response;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/change-password', data);
        return response;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
};

export const googleAuth = async (): Promise<ApiResponse<{ url: string }>> => {
    try {
        const response = await authApiClient.get<ApiResponse<{ url: string }>>('/api/auth/google');
        return response;
    } catch (error) {
        console.error('Google auth error:', error);
        throw error;
    }
};

export const googleCallback = async (code: string): Promise<ApiResponse<GoogleAuthResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<GoogleAuthResponse['data']>>('/api/auth/google/callback', { code });
        return response;
    } catch (error) {
        console.error('Google callback error:', error);
        throw error;
    }
};

export const verifyAccount = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/verify-account', data);
        return response;
    } catch (error) {
        console.error('Verify account error:', error);
        throw error;
    }
};

export const requestUpdate = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/request-update');
        return response;
    } catch (error) {
        console.error('Request update error:', error);
        throw error;
    }
};

export const updateUser = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await authApiClient.put<ApiResponse<ProfileResponse['data']>>('/api/auth/user', data);
        if (response.success && response.data?.user) {
            const { user } = response.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
        }
        return response;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const getProfile = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await authApiClient.get<ApiResponse<ProfileResponse['data']>>('/api/auth/profile');
        return response;
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
};

export const verifyToken = async (): Promise<ApiResponse<TokenVerifyResponse['data']>> => {
    try {
        const response = await authApiClient.get<ApiResponse<TokenVerifyResponse['data']>>('/api/auth/verify-token');
        return response;
    } catch (error) {
        console.error('Verify token error:', error);
        throw error;
    }
};

export const checkAuth = async (): Promise<ApiResponse<AuthCheckResponse>> => {
    try {
        const response = await authApiClient.get<ApiResponse<AuthCheckResponse>>('/api/auth/check-auth');
        return response;
    } catch (error) {
        console.error('Check auth error:', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await authApiClient.get<ApiResponse<ProfileResponse['data']>>('/api/auth/profile');
        return response;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

export const loginWithGoogle = async (token: string): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/google/login', { token });
        if (response.success && response.data) {
            const { user, accessToken, refreshToken } = response.data;
            setAuthData({ accessToken, refreshToken, user });
        }
        return response;
    } catch (error) {
        console.error('Login with Google error:', error);
        throw error;
    }
};

function clearAuthData(): void {
    clearAuthCookies();
    clearAuthStorage();
}

// Default export for backward compatibility
export default authService; 