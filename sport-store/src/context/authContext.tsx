"use client";

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_CONFIG } from '@/config/token';
import { getUserData, setUserData, clearUserData } from '@/config/user';
import type { AuthUser } from '@/types/auth';
import { handleRedirect, setJustLoggedOut, getJustLoggedOut, clearJustLoggedOut } from '@/utils/navigationUtils';
import { axiosInstance } from '@/config/axios';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/config/constants';
import type {
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
    UpdateProfileRequest,
    LoginResponse
} from '@/types/auth';
import {
    register as registerService,
    logout as logoutService,
    verifyOTP as verifyOTPService,
    resendOTP as resendOTPService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
    updateProfile as updateProfileService,
    requestUpdate as requestUpdateService,
    updateUser as updateUserService
} from '@/services/authService';
import sessionManager from '@/utils/sessionManager';

// Constants
// const CHECK_INTERVAL = 5000; // 5 seconds

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<LoginResponse>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    verifyOTP: (data: VerifyOTPRequest) => Promise<void>;
    resendOTP: (data: { email: string }) => Promise<{ success: boolean }>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    verifyAccount: (data: VerifyOTPRequest) => Promise<void>;
    requestUpdate: () => Promise<void>;
    updateUser: (data: UpdateProfileRequest) => Promise<void>;
    loginWithGoogle: (token: string) => Promise<{ success: boolean; user: AuthUser | null }>;
    setUser: (user: AuthUser | null) => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const lastCheckRef = useRef<number>(0);
    const isInitializedRef = useRef(false);
    const userRef = useRef<AuthUser | null>(null);
    const isAuthenticatedRef = useRef(false);

    // Cập nhật ref khi state thay đổi
    useEffect(() => {
        userRef.current = user;
        isAuthenticatedRef.current = isAuthenticated;
    }, [user, isAuthenticated]);

    // Debug effect để theo dõi thay đổi trạng thái
    useEffect(() => {
        // Chỉ log khi có thay đổi quan trọng
        if (user || isAuthenticated) {
            console.log("🔄 Auth state changed:", {
                hasUser: !!user,
                isAuthenticated,
                loading,
                userRole: user?.role
            });
        }
    }, [user, isAuthenticated, loading]);

    const updateAuthState = useCallback((user: AuthUser | null, isAuthenticated: boolean) => {
        console.log('🔄 updateAuthState called:', {
            hasUser: !!user,
            isAuthenticated,
            userRole: user?.role,
            timestamp: new Date().toISOString()
        });
        
        try {
            setUser(user);
            setIsAuthenticated(isAuthenticated);
            setLoading(false);
            
            // Cập nhật refs
            userRef.current = user;
            isAuthenticatedRef.current = isAuthenticated;
            lastCheckRef.current = Date.now();
            
            console.log('✅ updateAuthState completed successfully');
        } catch (error) {
            console.error('❌ updateAuthState error:', error);
        }
    }, []);

    const checkAuthStatus = useCallback(async (): Promise<void> => {
        try {
            const now = Date.now();
            if (lastCheckRef.current && now - lastCheckRef.current < 5000) {
                return;
            }

            // Kiểm tra flag justLoggedOut
            if (getJustLoggedOut()) {
                return;
            }

            const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
            const storedUser = getUserData();

            if (!accessToken && !refreshToken) {
                // Chỉ log khi thực sự cần thiết
                if (userRef.current || isAuthenticatedRef.current) {
                    updateAuthState(null, false);
                }
                return;
            }

            // Nếu có stored user và access token, khôi phục state ngay lập tức
            if (storedUser && accessToken) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                
                // Set cookies để middleware có thể đọc được
                const userCookieValue = encodeURIComponent(JSON.stringify(storedUser));
                document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${accessToken}; path=/; max-age=${TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userCookieValue}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                
                updateAuthState(storedUser, true);
                
                // Verify với server trong background
                try {
                    const response = await axiosInstance.get('/auth/check');
                    if (response.data.success) {
                        const user = response.data.data;
                        setUserData(user); // Cập nhật user data mới
                        
                        // Set cookies để middleware có thể đọc được
                        const userCookieValue = encodeURIComponent(JSON.stringify(user));
                        document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${accessToken}; path=/; max-age=${TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                        document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userCookieValue}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                        
                        updateAuthState(user, true);
                        return;
                    }
                } catch {
                    // Giữ nguyên stored user nếu server check thất bại
                    return;
                }
            }

            // Nếu có access token, verify ngay
            if (accessToken) {
                try {
                    // Set Authorization header trước khi gọi API
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    
                    const response = await axiosInstance.get('/auth/check');
                    if (response.data.success) {
                        const user = response.data.data;
                        setUserData(user); // Lưu user data mới
                        updateAuthState(user, true);
                        return;
                    }
                } catch {
                    // Access token invalid, thử refresh
                }
            }

            // Nếu có refresh token, thử refresh
            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
                    if (response.data.success) {
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = response.data.data;
                        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, newAccessToken);
                        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
                        setUserData(user); // Lưu user data mới
                        
                        // Set cookies để middleware có thể đọc được
                        const userCookieValue = encodeURIComponent(JSON.stringify(user));
                        document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${newAccessToken}; path=/; max-age=${TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                        document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME}=${newRefreshToken}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                        document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userCookieValue}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                        
                        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        updateAuthState(user, true);
                        return;
                    }
                } catch {
                    // Refresh token invalid
                }
            }

            // Nếu không có token hợp lệ, clear state
            if (userRef.current || isAuthenticatedRef.current) {
                updateAuthState(null, false);
                clearUserData();
                localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
                localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
                delete axiosInstance.defaults.headers.common['Authorization'];
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            // Không restore storedUser khi có lỗi
            updateAuthState(null, false);
            localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }, [updateAuthState]);

    // Khởi tạo state từ localStorage khi component mount
    useEffect(() => {
        const initializeAuth = async () => {
            if (isInitializedRef.current) {
                return;
            }
            isInitializedRef.current = true;
            
            await checkAuthStatus();
        };

        initializeAuth();
    }, [checkAuthStatus]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            
            if (response.data.success && response.data.data) {
                const { user, accessToken, refreshToken } = response.data.data;
                
                try {
                    // Lưu tokens vào localStorage trước
                    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
                    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, refreshToken);
                    
                    // Lưu tokens vào cookies để middleware có thể đọc được
                    document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${accessToken}; path=/; max-age=${TOKEN_CONFIG.ACCESS_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                    document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME}=${refreshToken}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                    
                    // Lưu user data
                    setUserData(user);
                    
                    // Lưu user data vào cookie để middleware có thể đọc được
                    const userCookieValue = encodeURIComponent(JSON.stringify(user));
                    document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${userCookieValue}; path=/; max-age=${TOKEN_CONFIG.REFRESH_TOKEN.EXPIRY / 1000}; SameSite=Lax`;
                    
                    // Set Authorization header cho axios
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    
                    updateAuthState(user, true);
                    
                    return {
                        success: true,
                        user,
                        message: 'Đăng nhập thành công'
                    };
                } catch (error) {
                    console.error('Error saving auth data:', error);
                    throw new Error('Lỗi khi lưu thông tin đăng nhập');
                }
            } else {
                throw new Error(response.data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const response = await registerService(data);
            if (response.success) {
                toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
                await handleRedirect(router, null, window.location.pathname);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutService();
            
            // Set flag để tránh redirect ngay sau logout
            setJustLoggedOut();
            
            // Clear session manager
            sessionManager.clearSession();
            
            // Xóa user data ngay lập tức
            clearUserData();
            
            // Xóa tokens từ localStorage
            localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
            
            // Xóa tokens từ cookies với đúng tên
            document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
            document.cookie = `${TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
            document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
            
            // Xóa Authorization header
            delete axiosInstance.defaults.headers.common['Authorization'];
            
            // Cập nhật state ngay lập tức
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            
            // Reset các ref
            userRef.current = null;
            isAuthenticatedRef.current = false;
            lastCheckRef.current = 0;
            isInitializedRef.current = false;
            
            // Thêm delay để đảm bảo state được reset hoàn toàn
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Clear flag sau 5 giây để cho phép auth check hoạt động bình thường
            setTimeout(() => {
                // Clear justLoggedOut flag
                localStorage.removeItem('justLoggedOut');
            }, 5000);
            
            toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
            // Không redirect ở đây, để component hoặc route bảo vệ tự redirect
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const verifyOTP = async (data: VerifyOTPRequest) => {
        try {
            await verifyOTPService(data);
            toast.success(SUCCESS_MESSAGES.ACCOUNT_VERIFIED);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('OTP verification failed:', error);
            throw error;
        }
    };

    const resendOTP = async (data: { email: string }) => {
        try {
            setLoading(true);
            const response = await resendOTPService({ email: data.email });
            
            if (response.success) {
                setLoading(false);
                toast.success(SUCCESS_MESSAGES.ACCOUNT_VERIFIED);
                return { success: true };
            } else {
                setLoading(false);
                throw new Error(response.message || 'Gửi lại mã OTP thất bại');
            }
        } catch (error) {
            console.error('❌ Lỗi khi gửi lại mã OTP:', error);
            setLoading(false);
            throw error;
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            await forgotPasswordService(email);
            toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Forgot password failed:', error);
            throw error;
        }
    };

    const resetPassword = async (data: ResetPasswordRequest) => {
        try {
            await resetPasswordService(data.token, data.newPassword);
            toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Reset password failed:', error);
            throw error;
        }
    };

    const updateProfile = async (data: UpdateProfileRequest) => {
        try {
            await updateProfileService(data);
            toast.success(SUCCESS_MESSAGES.UPDATE_PROFILE_SUCCESS);
            // Kiểm tra flag trước khi redirect
            if (!getJustLoggedOut()) {
                await handleRedirect(router, user, window.location.pathname);
            }
        } catch (error) {
            console.error('Update profile failed:', error);
            throw error;
        }
    };

    const verifyAccount = async (data: VerifyOTPRequest) => {
        try {
            await verifyOTPService(data);
            toast.success(SUCCESS_MESSAGES.ACCOUNT_VERIFIED);
            await handleRedirect(router, null, window.location.pathname);
        } catch (error) {
            console.error('Account verification failed:', error);
            throw error;
        }
    };

    const requestUpdate = async () => {
        try {
            await requestUpdateService();
            toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
            // Kiểm tra flag trước khi redirect
            if (!getJustLoggedOut()) {
                await handleRedirect(router, user, window.location.pathname);
            }
        } catch (error) {
            console.error('Request update failed:', error);
            throw error;
        }
    };

    const updateUser = async (data: UpdateProfileRequest) => {
        try {
            await updateUserService(data);
            toast.success(SUCCESS_MESSAGES.UPDATE_PROFILE_SUCCESS);
            // Kiểm tra flag trước khi redirect
            if (!getJustLoggedOut()) {
                await handleRedirect(router, user, window.location.pathname);
            }
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    };

    const loginWithGoogle = async (token: string) => {
        try {
            // Lưu token ngay lập tức
            localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Gọi API để lấy thông tin user
            const response = await axiosInstance.get('/auth/check');
            
            if (response.data.success) {
                const user = response.data.data;
                updateAuthState(user, true);
                return { success: true, user };
            } else {
                throw new Error('Failed to get user data');
            }
        } catch (error) {
            console.error('Google login failed:', error);
            return { success: false, user: null };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        updateProfile,
        verifyAccount,
        requestUpdate,
        updateUser,
        loginWithGoogle,
        setUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

