"use client";

import React, { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_CONFIG } from '@/config/token';
import type { AuthUser } from '@/types/auth';
import { handleRedirect } from '@/utils/navigationUtils';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '@/config/constants';
import { UserRole } from '@/types/base';
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
    updateUser as updateUserService,
    loginWithGoogle as loginWithGoogleService
} from '@/services/authService';
import { AxiosError } from 'axios';

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
    loginWithGoogle: (token: string) => Promise<{ success: boolean }>;
    setUser: (user: AuthUser | null) => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const isAuthenticatingRef = useRef(false);
    const lastCheckRef = useRef<number>(0);
    const retryCountRef = useRef<number>(0);
    const maxRetries = 3;

    const checkAuthStatus = useCallback(async () => {
        try {
            // Kiểm tra xem có đang xác thực không
            if (isAuthenticatingRef.current) {
                console.log("⏳ Đang có request xác thực đang chạy, đợi kết quả");
                return;
            }

            // Kiểm tra thời gian từ lần check cuối
            const now = Date.now();
            if (now - lastCheckRef.current < 5000) { // 5 giây
                console.log("⏳ Đợi ít nhất 5 giây giữa các lần check");
                return;
            }

            isAuthenticatingRef.current = true;
            console.log("🔍 Checking auth status...");
            
            // Kiểm tra token trong localStorage
            const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);

            if (!accessToken) {
                console.log("❌ No access token found");
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            // Gọi API kiểm tra xác thực với retry mechanism
            let response;
            while (retryCountRef.current < maxRetries) {
                try {
                    response = await api.get("/auth/check");
                    console.log("📥 Auth check response:", response);
                    break;
                } catch (error: any) {
                    console.error("❌ Error in auth check:", error);
                    
                    // Nếu lỗi 401 và có refresh token, thử refresh
                    if (error.response?.status === 401 && refreshToken) {
                        try {
                            console.log("🔄 Attempting to refresh token...");
                            const refreshResponse = await api.post("/auth/refresh-token", { refreshToken });
                            
                            if (refreshResponse.data.success) {
                                const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = refreshResponse.data.data;
                                
                                // Lưu cả 2 token mới
                                localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, newAccessToken);
                                localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, newRefreshToken);
                                
                                // Cập nhật header
                                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                                
                                // Cập nhật state
                                setUser(userData);
                                setIsAuthenticated(true);
                                
                                // Thử lại request ban đầu
                                response = await api.get("/auth/check");
                                break;
                            }
                        } catch (refreshError) {
                            console.error("❌ Token refresh failed:", refreshError);
                        }
                    }
                    
                    retryCountRef.current++;
                    if (retryCountRef.current === maxRetries) {
                        throw error;
                    }
                    console.log(`🔄 Retrying auth check (${retryCountRef.current}/${maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCountRef.current));
                }
            }

            if (response?.data.success) {
                const userData = response.data.data;
                
                // Kiểm tra dữ liệu user có tồn tại
                if (!userData) {
                    console.log("❌ No user data in response");
                    throw new Error("No user data");
                }

                // Cập nhật state
                setUser(userData);
                setIsAuthenticated(true);

                // Lưu vào localStorage
                localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(userData));

                // Reset retry count on success
                retryCountRef.current = 0;
            } else {
                console.log("❌ Auth check failed");
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
            }
        } catch (error) {
            console.error("❌ Error in auth check:", error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);

            // Nếu lỗi 401, xóa token
            if (error.response?.status === 401) {
                localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
                localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
                delete api.defaults.headers.common['Authorization'];
            }
        } finally {
            isAuthenticatingRef.current = false;
            lastCheckRef.current = Date.now();
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            if (isAuthenticatingRef.current) {
                console.log("⏳ Đang có request đăng nhập đang chạy, đợi kết quả");
                return { success: false, message: "Đang xử lý đăng nhập" };
            }

            isAuthenticatingRef.current = true;
            setLoading(true);
            console.log("🔑 Đang thử đăng nhập với email:", email);

            const response = await api.post("/auth/login", { email, password });
            console.log("📥 Login response:", response);

            if (response.data.success && response.data.data) {
                const { accessToken, user: userData } = response.data.data;
                console.log("✅ Đăng nhập thành công, user data:", userData);

                // Lưu token vào localStorage
                localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
                localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(userData));

                // Cập nhật state
                setUser(userData);
                setIsAuthenticated(true);

                // Set token vào header cho tất cả các request
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Đợi một chút để đảm bảo state đã được cập nhật
                await new Promise(resolve => setTimeout(resolve, 100));

                // Chuyển hướng dựa trên role
                if (userData.role === UserRole.ADMIN) {
                    console.log("👑 User là admin, chuyển hướng đến dashboard");
                    router.push("/admin/dashboard");
                } else {
                    console.log("👤 User là user thường, chuyển hướng đến trang chủ");
                    router.push("/");
                }

                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                return response.data;
            } else {
                console.error("❌ Đăng nhập thất bại:", response.data.message);
                toast.error(response.data.message || "Đăng nhập thất bại");
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error("❌ Lỗi khi đăng nhập:", error);
            const errorMessage = error instanceof Error ? error.message : "Đăng nhập thất bại";
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            isAuthenticatingRef.current = false;
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
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
            await handleRedirect(router, null, window.location.pathname);
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
            const response = await resendOTPService(data.email);
            console.log('Resend OTP response:', response);
            
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
            await handleRedirect(router, user, window.location.pathname);
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
            await handleRedirect(router, user, window.location.pathname);
        } catch (error) {
            console.error('Request update failed:', error);
            throw error;
        }
    };

    const updateUser = async (data: UpdateProfileRequest) => {
        try {
            await updateUserService(data);
            toast.success(SUCCESS_MESSAGES.UPDATE_PROFILE_SUCCESS);
            await handleRedirect(router, user, window.location.pathname);
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    };

    const loginWithGoogle = async (token: string) => {
        try {
            setLoading(true);
            const response = await loginWithGoogleService(token);
            console.log('Google login response:', response);
            
            if (response.success && response.data?.user) {
                const userData = response.data.user as AuthUser;
                setUser(userData);
                setIsAuthenticated(true);
                setLoading(false);
                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                const urlParams = new URLSearchParams(window.location.search);
                const from = urlParams.get('from') || undefined;
                const redirectPath = from || (userData.role === UserRole.ADMIN ? '/admin/dashboard' : '/user');
                console.log('🔄 Redirecting after login:', redirectPath);
                await router.replace(redirectPath);
                return { success: true };
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                throw new Error(response.message || 'Đăng nhập với Google thất bại');
            }
        } catch (error) {
            console.error('❌ Lỗi khi đăng nhập với Google:', error);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            throw error;
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

