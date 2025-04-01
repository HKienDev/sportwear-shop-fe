import type { 
    VerifyOTPRequest, 
    UpdateProfileRequest,
    GoogleAuthResponse,
    LoginResponse,
    AuthCheckResponse,
    TokenVerifyResponse,
    ProfileResponse,
    EmptyResponse,
    AuthUser,
    AuthResponseData
} from '@/types/auth';
import apiClient from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { isAdmin } from '@/utils/roleUtils';
import { setAuthCookies, clearAuthCookies } from '@/utils/cookieUtils';
import { setAuthStorage, clearAuthStorage } from '@/utils/storageUtils';
import { TOKEN_CONFIG } from '@/config/token';
import { canCheckAuth, startAuthCheck, endAuthCheck } from '@/utils/cooldownUtils';

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

const clearAuthData = (): void => {
    clearAuthCookies();
    clearAuthStorage();
};

// Auth service functions
export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponseData>> => {
    try {
        console.log('🔐 Attempting login with email:', email);
        const response = await apiClient.auth.login(email, password);
        console.log('📥 Login response:', response);
        
        if (!response?.data) {
            console.log('❌ No response data');
            throw new Error('Đăng nhập thất bại');
        }
        
        // Kiểm tra nếu response là string (trường hợp lỗi rate limiting)
        if (typeof response.data === 'string') {
            console.log('❌ Rate limit error:', response.data);
            throw new Error(response.data);
        }
        
        const responseData = response.data as ApiResponse<AuthResponseData>;
        console.log('📦 Parsed response data:', responseData);
        
        if (!responseData.success || !responseData.data) {
            console.log('❌ Login failed:', responseData.message);
            throw new Error(responseData.message || 'Đăng nhập thất bại');
        }

        const { user, accessToken, refreshToken } = responseData.data;
        console.log('✅ Login successful, setting auth data');
        setAuthData({ accessToken, refreshToken, user });
        
        return responseData;
    } catch (error) {
        console.error('🚨 Login error:', error);
        throw error;
    }
};

export const register = async (data: { email: string; password: string; name: string }): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.auth.register(data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logout = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.logout();
        if (response.data.success) {
            clearAuthData();
        }
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        clearAuthData(); // Clear data even if API call fails
        throw error;
    }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.forgotPassword(email);
        return response.data;
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.resetPassword(token, newPassword);
        return response.data;
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const verifyOTP = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.verifyOTP(data);
        return response.data;
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
};

export const resendOTP = async (email: string): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.resendOTP(email);
        if (response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Resend OTP error:', error);
        throw error;
    }
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.updateProfile(data);
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
        const response = await apiClient.auth.changePassword(data);
        return response.data;
    } catch (error) {
        console.error('Change password error:', error);
        throw error;
    }
};

export const googleAuth = async (): Promise<ApiResponse<{ url: string }>> => {
    try {
        const response = await apiClient.auth.googleAuth();
        return response.data;
    } catch (error) {
        console.error('Google auth error:', error);
        throw error;
    }
};

export const googleCallback = async (code: string): Promise<ApiResponse<GoogleAuthResponse['data']>> => {
    try {
        const response = await apiClient.auth.googleCallback(code);
        if (response.data.success && response.data.data) {
            const { user, accessToken, refreshToken } = response.data.data;
            setAuthData({ accessToken, refreshToken, user });
            
            if (user.role === 'admin') {
                window.location.replace('/admin');
            } else {
                window.location.replace('/');
            }
        }
        return response.data;
    } catch (error) {
        console.error('Google callback error:', error);
        throw error;
    }
};

export const verifyAccount = async (data: VerifyOTPRequest): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.verifyAccount(data);
        return response.data;
    } catch (error) {
        console.error('Verify account error:', error);
        throw error;
    }
};

export const requestUpdate = async (): Promise<ApiResponse<EmptyResponse['data']>> => {
    try {
        const response = await apiClient.auth.requestUpdate();
        return response.data;
    } catch (error) {
        console.error('Request update error:', error);
        throw error;
    }
};

export const updateUser = async (data: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.updateUser(data);
        if (response.data.success && response.data.data) {
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(response.data.data));
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${JSON.stringify(response.data.data)}; path=/;`;
        }
        return response.data;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

export const getProfile = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.getProfile();
        if (response.data.success && response.data.data) {
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(response.data.data));
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${JSON.stringify(response.data.data)}; path=/;`;
        }
        return response.data;
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
};

export const verifyToken = async (): Promise<ApiResponse<TokenVerifyResponse['data']>> => {
    try {
        const response = await apiClient.auth.verifyToken();
        return response.data;
    } catch (error) {
        console.error('Verify token error:', error);
        throw error;
    }
};

export const checkAuth = async (force: boolean = false): Promise<AuthCheckResponse> => {
    try {
        // Kiểm tra cooldown trước khi thực hiện check, trừ khi force=true
        if (!force && !canCheckAuth()) {
            console.log('⏳ Đang trong thời gian cooldown, bỏ qua check auth');
            throw new Error('Auth check cooldown');
        }

        // Bắt đầu check auth
        startAuthCheck();

        // Kiểm tra xem có token trong localStorage không
        const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        if (!token) {
            clearAuthData();
            throw new Error('No token found');
        }

        const response = await apiClient.auth.checkAuth();
        
        // Kết thúc check auth
        endAuthCheck();

        if (response.data.success && response.data.user) {
            const { user } = response.data;
            const userStr = JSON.stringify(user);
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, userStr);
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            
            // Log role check
            console.log('🔑 User role:', user.role);
            console.log('👑 Is admin:', isAdmin(user));
        } else {
            clearAuthData();
            throw new Error('No user found');
        }

        return response.data;
    } catch (error) {
        // Kết thúc check auth nếu có lỗi
        endAuthCheck();
        console.error('Check auth error:', error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<ApiResponse<ProfileResponse['data']>> => {
    try {
        const response = await apiClient.auth.getProfile();
        return response.data;
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
};

export const refreshToken = async (): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.auth.refreshToken();
        return response.data;
    } catch (error) {
        console.error('Refresh token error:', error);
        throw error;
    }
};

export const loginWithGoogle = async (token: string): Promise<ApiResponse<LoginResponse['data']>> => {
    try {
        const response = await apiClient.auth.googleCallback(token);
        if (response.data.success && response.data.data?.user) {
            const userData = response.data.data.user;
            localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(userData));
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${JSON.stringify(userData)}; path=/;`;
            
            // Log role check
            console.log('🔑 User role:', userData.role);
            console.log('👑 Is admin:', isAdmin(userData));
        }
        return response.data;
    } catch (error) {
        console.error('Login with Google error:', error);
        throw error;
    }
}; 