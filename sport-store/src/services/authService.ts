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
import { apiClient } from '@/lib/apiClient';
import type { ApiResponse } from '@/types/api';
import { isAdmin } from '@/utils/roleUtils';
import { setAuthCookies, clearAuthCookies } from '@/utils/cookieUtils';
import { setAuthStorage, clearAuthStorage } from '@/utils/storageUtils';
import { TOKEN_CONFIG } from '@/config/token';
import { AxiosError } from 'axios';
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

// Auth service functions
export const authService = {
  // Login
  async login(credentials: LoginCredentials) {
    const response = await apiClient.login(credentials);
    return response.data;
  },

  // Register
  async register(userData: RegisterRequest) {
    const response = await apiClient.register(userData);
    return response.data;
  },

  // Logout
  async logout() {
    const response = await apiClient.logout();
    return response.data;
  },

  // Refresh token
  async refreshToken() {
    const response = await apiClient.refreshToken();
    return response.data;
  },

  // Get user profile
  async getProfile() {
    const response = await apiClient.getProfile();
    return response.data;
  },

  // Verify token
  async verifyToken() {
    const response = await apiClient.get('/api/auth/verify-token');
    return response.data;
  }
};

// Individual exports for backward compatibility
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.login(credentials);
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            setAuthData({ accessToken, refreshToken, user });
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.register(userData);
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logout = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.logout();
        // Clear auth data
        clearAuthCookies();
        clearAuthStorage();
        return response.data;
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
        const response = await apiClient.forgotPassword(email);
        return response.data;
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.resetPassword(token, newPassword);
        return response.data;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.verifyOTP(data);
        return response.data;
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
};

export const resendOTP = async (data: { email: string }): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.resendOTP(data);
        return response.data;
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.updateProfile(data);
        if (response.data.success && response.data.data?.user) {
            const { user } = response.data.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
        }
        return response.data;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.changePassword(data);
        return response.data;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
};

export const googleAuth = async (): Promise<ApiResponse<{ url: string }>> => {
    try {
        const response = await apiClient.googleAuth();
        return response.data;
    } catch (error) {
        console.error('Google auth error:', error);
        throw error;
    }
};

export const googleCallback = async (code: string): Promise<ApiResponse<GoogleAuthResponse['data']>> => {
    try {
        const response = await apiClient.googleCallback(code);
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            setAuthData({ accessToken, refreshToken, user });
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
            
            // Không redirect ở đây, để component/context xử lý
        }
        return response.data;
    } catch (error) {
        console.error('Google callback error:', error);
        throw error;
    }
};

export const verifyAccount = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.verifyAccount(data);
        return response.data;
    } catch (error) {
        console.error('Verify account error:', error);
        throw error;
    }
};

export const requestUpdate = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.requestUpdate();
        return response.data;
    } catch (error) {
        console.error('Request update error:', error);
        throw error;
    }
};

export const updateUser = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.updateUser(data);
        if (response.data.success && response.data.data?.user) {
            const { user } = response.data.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
        }
        return response.data;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const getProfile = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.getProfile();
        return response.data;
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
};

export const verifyToken = async (): Promise<ApiResponse<TokenVerifyResponse['data']>> => {
    try {
        const response = await apiClient.verifyToken();
        return response.data;
    } catch (error) {
        console.error('Verify token error:', error);
        throw error;
    }
};

export const checkAuth = async (): Promise<ApiResponse<AuthCheckResponse>> => {
    try {
        const response = await apiClient.checkAuth();
        return response.data;
    } catch (error) {
        console.error('Check auth error:', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.getProfile();
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

export const loginWithGoogle = async (token: string): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.loginWithGoogle(token);
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            setAuthData({ accessToken, refreshToken, user });
        }
        return response.data;
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