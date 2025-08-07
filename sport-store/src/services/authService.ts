import type { ApiResponse } from '@/types/api';
import type { 
  LoginResponse, 
  RegisterRequest, 
  LoginCredentials, 
  EmptyResponse, 
  ProfileResponse, 
  TokenVerifyResponse, 
  AuthCheckResponse, 
  GoogleAuthResponse, 
  VerifyOTPRequest, 
  UpdateProfileRequest,
  AuthUser 
} from '@/types/auth';
import { TOKEN_CONFIG } from '@/config/token';

interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

const setAuthData = ({ accessToken, refreshToken, user }: AuthData): void => {
    // Set data in both cookies and localStorage
    setAuthCookies(accessToken, refreshToken, JSON.stringify(user));
    setAuthStorage(accessToken, refreshToken, user);
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
  // Đăng nhập
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse['data']>> {
    try {
      const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/login', { email, password });
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Lưu token vào localStorage
        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, refreshToken);
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(user));
        
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('❌ AuthService - Login error:', error);
      throw error;
    }
  },

  // Đăng ký
  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse['data']>> {
    try {
      const response = await authApiClient.post<ApiResponse<LoginResponse['data']>>('/api/auth/register', userData);
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        
        // Lưu token vào localStorage
        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, refreshToken);
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(user));
        
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('❌ AuthService - Register error:', error);
      throw error;
    }
  },

  // Đăng xuất
  async logout(): Promise<ApiResponse<EmptyResponse['data']>> {
    try {
      // Gọi API logout để invalidate token trên server
      const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/logout');
      
      // Xóa token khỏi localStorage
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
      localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
      
      // Xóa chat-related localStorage
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('tempUserId');
      localStorage.removeItem('userId');
      
      return response;
    } catch (error) {
      console.error('❌ AuthService - Logout error:', error);
      // Clear auth data even if API call fails
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
      localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
      
      // Clear chat-related localStorage even if API call fails
      localStorage.removeItem('currentUserId');
      localStorage.removeItem('tempUserId');
      localStorage.removeItem('userId');
      
      throw error;
    }
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser(): Promise<ApiResponse<ProfileResponse['data']>> {
    try {
      const response = await authApiClient.get<ApiResponse<ProfileResponse['data']>>('/api/auth/profile');
      return response;
    } catch (error) {
      console.error('❌ AuthService - Get current user error:', error);
      throw error;
    }
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<EmptyResponse['data']>> {
    try {
      const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
      
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      const response = await authApiClient.post<ApiResponse<EmptyResponse['data']>>('/api/auth/refresh-token', { refreshToken });
      
      if (response.success && response.data) {
        const { user, accessToken, refreshToken: newRefreshToken } = response.data as {
          user: AuthUser;
          accessToken: string;
          refreshToken: string;
        };
        
        // Cập nhật token trong localStorage
        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
        
        // Cập nhật thông tin user trong localStorage
        localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(user));
        
        return response;
      }
      
      return response;
    } catch (error) {
      console.error('❌ AuthService - Refresh token error:', error);
      throw error;
    }
  },

  // Kiểm tra xem user có đăng nhập không
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    return !!token;
  },

  // Kiểm tra xem user có phải admin không
  isAdmin(): boolean {
    const userStr = localStorage.getItem(TOKEN_CONFIG.USER.STORAGE_KEY);
    if (!userStr) return false;
    
    try {
      const user = JSON.parse(userStr);
      return user.role === 'admin';
    } catch (error) {
      console.error('❌ AuthService - Error parsing user data:', error);
      return false;
    }
  },

  // Lấy thông tin user từ localStorage
  getCurrentUserFromStorage(): AuthUser | null {
    const userStr = localStorage.getItem(TOKEN_CONFIG.USER.STORAGE_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('❌ AuthService - Error parsing user data from storage:', error);
      return null;
    }
  },

  // Lấy access token từ localStorage
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
  },

  // Lấy refresh token từ localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
  }
};

// Helper functions for cookies and storage
function setAuthCookies(accessToken: string, refreshToken: string, userStr: string): void {
  if (typeof document !== 'undefined') {
    // Sử dụng cấu hình cookie phù hợp với môi trường development
    const isSecure = process.env.NODE_ENV === 'production';
    const sameSite = isSecure ? 'strict' : 'lax';
    const secureFlag = isSecure ? '; secure' : '';
    
    document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${accessToken}; path=/; samesite=${sameSite}${secureFlag}`;
    document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME}=${refreshToken}; path=/; samesite=${sameSite}${secureFlag}`;
    document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; samesite=${sameSite}${secureFlag}`;
  }
}

function setAuthStorage(accessToken: string, refreshToken: string, user: AuthUser): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, refreshToken);
    localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(user));
  }
}

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
        return response;
    } catch (error) {
        console.error('Logout error:', error);
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
            if (typeof document !== 'undefined') {
                document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            }
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
            if (typeof document !== 'undefined') {
                document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userStr}; path=/; secure; samesite=strict`;
            }
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
        const response = await authApiClient.get<ApiResponse<AuthCheckResponse>>('/api/auth/check');
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
        return response;
    } catch (error) {
        console.error('Login with Google error:', error);
        throw error;
    }
}; 