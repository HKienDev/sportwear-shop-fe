"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES } from '@/config/constants';
import { TOKEN_CONFIG } from '@/config/token';
import type { AuthUser } from '@/types/auth';
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
import { handleRedirect } from '@/utils/navigationUtils';
import apiClient from '@/lib/api';
import debounce from 'lodash/debounce';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (credentials: { email: string; password: string }) => Promise<LoginResponse>;
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

const AUTH_CONFIG = {
    CHECK_INTERVAL: 5000, // 5 seconds
    TOKEN_KEY: 'token',
    USER_KEY: 'user'
} as const;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter() as AppRouterInstance;
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const checkAuthPromiseRef = React.useRef<Promise<void> | null>(null);
    const lastCheckRef = React.useRef<number>(0);
    const isAuthenticatingRef = React.useRef(false);

    const checkAuthStatus = React.useCallback(async () => {
        try {
            if (checkAuthPromiseRef.current) {
                console.log('⏳ Đang có request check auth đang chạy, đợi kết quả');
                return;
            }

            const now = Date.now();
            if (now - lastCheckRef.current < AUTH_CONFIG.CHECK_INTERVAL) {
                return;
            }

            const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
            if (!token) {
                return;
            }

            checkAuthPromiseRef.current = (async () => {
                try {
                    const response = await apiClient.auth.check();
                    console.log('📥 Auth check response:', response.data);
                    
                    if (response.data.success && response.data.data) {
                        console.log('🔍 Auth check data structure:', response.data.data);
                        
                        const responseData = response.data.data as unknown;
                        const userData = responseData as AuthUser;

                        if (!userData || !userData.role || !userData.email) {
                            console.error('❌ Invalid user data structure:', userData);
                            throw new Error('Invalid user data structure');
                        }

                        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userData));
                        setUser(userData);
                        setIsAuthenticated(true);

                        const currentPath = window.location.pathname;
                        console.log('🔄 Current path:', currentPath);
                        console.log('👤 User role:', userData.role);

                        await handleRedirect(router, userData, currentPath);
                    } else {
                        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
                        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
                        setUser(null);
                        setIsAuthenticated(false);

                        if (!window.location.pathname.startsWith('/auth/')) {
                            await handleRedirect(router, null, window.location.pathname);
                        }
                    }
                } catch (error) {
                    console.error('❌ Lỗi khi check auth:', error);
                    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
                    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
                    setUser(null);
                    setIsAuthenticated(false);
                    
                    if (!window.location.pathname.startsWith('/auth/')) {
                        await handleRedirect(router, null, window.location.pathname);
                    }
                } finally {
                    checkAuthPromiseRef.current = null;
                    lastCheckRef.current = Date.now();
                }
            })();

            await checkAuthPromiseRef.current;
        } catch (error) {
            console.error('❌ Error in checkAuthStatus:', error);
        }
    }, [router]);

    const debouncedCheckAuth = React.useCallback(
        () => {
            const debouncedFn = debounce(() => {
                void checkAuthStatus();
            }, 1000);
            debouncedFn();
        },
        [checkAuthStatus]
    );

    React.useEffect(() => {
        if (!window.location.pathname.startsWith('/auth/')) {
            void debouncedCheckAuth();
        }

        let intervalId: NodeJS.Timeout | null = null;
        if (isAuthenticated && !window.location.pathname.startsWith('/auth/')) {
            intervalId = setInterval(() => void debouncedCheckAuth(), AUTH_CONFIG.CHECK_INTERVAL);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isAuthenticated, debouncedCheckAuth]);

    const login = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
        try {
            if (isAuthenticatingRef.current) {
                console.log('⏳ Đang có request đăng nhập đang chạy, đợi kết quả');
                return { success: false, message: 'Đang xử lý đăng nhập' };
            }

            isAuthenticatingRef.current = true;
            setLoading(true);
            console.log('🔑 Đang thử đăng nhập với email:', credentials.email);

            const response = await apiClient.auth.login(credentials.email, credentials.password);
            console.log('📥 Login response:', response.data);

            if (response.data.success && response.data.data) {
                const { accessToken, user: userData } = response.data.data;
                console.log('✅ Đăng nhập thành công, user data:', userData);

                // Lưu token vào localStorage
                localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
                localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(userData));

                // Lưu token vào cookie với options
                const cookieOptions = `${TOKEN_CONFIG.COOKIE_OPTIONS.PATH}; ${TOKEN_CONFIG.COOKIE_OPTIONS.SAME_SITE}; ${TOKEN_CONFIG.COOKIE_OPTIONS.SECURE ? 'Secure;' : ''} ${TOKEN_CONFIG.COOKIE_OPTIONS.HTTP_ONLY ? 'HttpOnly;' : ''}`;
                document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${accessToken}; ${cookieOptions}`;

                // Lưu user data vào cookie
                const userCookieData = {
                    _id: userData._id,
                    email: userData.email,
                    role: userData.role,
                    isActive: userData.isActive,
                    isVerified: userData.isVerified,
                    authStatus: userData.authStatus,
                    username: userData.username,
                    fullname: userData.fullname,
                    phone: userData.phone,
                    avatar: userData.avatar,
                    gender: userData.gender,
                    dob: userData.dob,
                    address: userData.address,
                    membershipLevel: userData.membershipLevel,
                    points: userData.points
                };
                document.cookie = `${TOKEN_CONFIG.USER.COOKIE_NAME}=${encodeURIComponent(JSON.stringify(userCookieData))}; ${cookieOptions}`;

                // Cập nhật state
                setUser(userData);
                setIsAuthenticated(true);

                // Đợi một chút để đảm bảo state đã được cập nhật
                await new Promise(resolve => setTimeout(resolve, 100));

                // Chuyển hướng dựa trên role
                if (userData.role === UserRole.ADMIN) {
                    console.log('👑 User là admin, chuyển hướng đến dashboard');
                    router.push('/admin/dashboard');
                } else {
                    console.log('👤 User là user thường, chuyển hướng đến trang chủ');
                    router.push('/');
                }

                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                return response.data;
            } else {
                console.error('❌ Đăng nhập thất bại:', response.data.message);
                toast.error(response.data.message || 'Đăng nhập thất bại');
                return response.data;
            }
        } catch (error) {
            console.error('❌ Lỗi khi đăng nhập:', error);
            toast.error('Đăng nhập thất bại');
            return { success: false, message: 'Đăng nhập thất bại' };
        } finally {
            setLoading(false);
            isAuthenticatingRef.current = false;
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

    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            handleRedirect(router, null, window.location.pathname);
        };

        window.addEventListener('logout', handleLogout);
        return () => window.removeEventListener('logout', handleLogout);
    }, [router]);

    useEffect(() => {
        const handleUserUpdated = (event: CustomEvent) => {
            setUser(event.detail);
        };

        window.addEventListener('userUpdated', handleUserUpdated as EventListener);
        return () => window.removeEventListener('userUpdated', handleUserUpdated as EventListener);
    }, []);

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

