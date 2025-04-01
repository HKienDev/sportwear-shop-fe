"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { NextRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { SUCCESS_MESSAGES, ROUTES, AUTH_CONFIG } from '@/config/constants';
import { TOKEN_CONFIG } from '@/config/token';
import type { AuthUser } from '@/types/auth';
import type {
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
    UpdateProfileRequest
} from '@/types/auth';
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    verifyOTP as verifyOTPService,
    resendOTP as resendOTPService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
    updateProfile as updateProfileService,
    checkAuth,
    requestUpdate as requestUpdateService,
    updateUser as updateUserService,
    loginWithGoogle as loginWithGoogleService
} from '@/services/authService';
import { handleRedirect } from '@/utils/navigationUtils';

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter() as unknown as NextRouter;
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isAuthenticatingRef = useRef(false);
    const lastCheckRef = useRef<number>(0);
    const checkAuthPromiseRef = useRef<Promise<void> | null>(null);

    const checkAuthStatus = useCallback(async () => {
        try {
            // Nếu đang có request check auth đang chạy, đợi nó hoàn thành
            if (checkAuthPromiseRef.current) {
                console.log('⏳ Đang có request check auth đang chạy, đợi kết quả');
                await checkAuthPromiseRef.current;
                return;
            }

            // Kiểm tra cooldown
            const now = Date.now();
            if (now - lastCheckRef.current < AUTH_CONFIG.CHECK_INTERVAL) {
                console.log('⏳ Đang trong thời gian cooldown, bỏ qua check auth');
                return;
            }

            // Kiểm tra xem có token trong localStorage không
            const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
            if (!token) {
                console.log('🔒 Không tìm thấy token, bỏ qua check auth');
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // Tạo promise mới và lưu vào ref
            checkAuthPromiseRef.current = (async () => {
                try {
                    const response = await checkAuth();
                    if (response.success && response.user) {
                        // Lưu user vào localStorage
                        localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(response.user));
                        setUser(response.user);
                        setIsAuthenticated(true);
                    } else {
                        // Xóa user khỏi localStorage nếu không có user
                        localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error('❌ Lỗi khi check auth:', error);
                    // Xóa user khỏi localStorage khi có lỗi
                    localStorage.removeItem(TOKEN_CONFIG.USER.STORAGE_KEY);
                    setUser(null);
                    setIsAuthenticated(false);
                    
                    // Nếu đang ở trang auth và không phải lỗi cooldown, không cần xử lý gì thêm
                    if (window.location.pathname.startsWith('/auth/') && error instanceof Error && error.message !== 'Auth check cooldown') {
                        return;
                    }
                    
                    // Nếu không phải trang auth, chuyển hướng về trang login
                    if (!window.location.pathname.startsWith('/auth/')) {
                        const currentPath = window.location.pathname;
                        router.push(`/auth/login?from=${encodeURIComponent(currentPath)}`);
                    }
                } finally {
                    lastCheckRef.current = Date.now();
                    setLoading(false);
                    checkAuthPromiseRef.current = null;
                }
            })();

            // Đợi promise hoàn thành
            await checkAuthPromiseRef.current;
        } catch (error) {
            console.error('❌ Lỗi khi check auth:', error);
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        // Chỉ check auth khi component mount
        checkAuthStatus();

        // Chỉ set interval nếu user đã đăng nhập
        let intervalId: NodeJS.Timeout | null = null;
        if (isAuthenticated) {
            intervalId = setInterval(() => {
                const now = Date.now();
                if (now - lastCheckRef.current >= AUTH_CONFIG.CHECK_INTERVAL) {
                    checkAuthStatus();
                }
            }, AUTH_CONFIG.CHECK_INTERVAL);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isAuthenticated, checkAuthStatus]);

    const login = async (data: LoginRequest) => {
        try {
            setLoading(true);
            isAuthenticatingRef.current = true;
            const response = await loginService(data.email, data.password);
            console.log('Login response:', response);
            
            if (response.success && response.data?.user) {
                const { user: userData, accessToken, refreshToken } = response.data;
                
                // Lưu token vào cookie
                document.cookie = `accessToken=${accessToken}; path=/; secure; samesite=strict`;
                document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`;
                
                // Lưu thông tin user và token
                await Promise.all([
                    new Promise(resolve => {
                        localStorage.setItem(TOKEN_CONFIG.USER.STORAGE_KEY, JSON.stringify(userData));
                        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, accessToken);
                        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY, refreshToken);
                        resolve(null);
                    }),
                    new Promise(resolve => {
                        setUser(userData);
                        setIsAuthenticated(true);
                        resolve(null);
                    })
                ]);

                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                
                // Xử lý chuyển hướng
                const urlParams = new URLSearchParams(window.location.search);
                const from = urlParams.get('from');
                const redirectPath = from ? decodeURIComponent(from) : (userData.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME);
                console.log('🔄 Redirecting after login to:', redirectPath);

                // Sử dụng window.location.href cho admin để reload hoàn toàn
                if (userData.role === 'admin' && redirectPath.includes('/admin')) {
                    window.location.href = redirectPath;
                } else {
                    router.push(redirectPath);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                throw new Error(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('❌ Lỗi khi đăng nhập:', error);
            setUser(null);
            setIsAuthenticated(false);
            throw error;
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
                const userData = response.data.user;
                setUser(userData);
                setIsAuthenticated(true);
                setLoading(false);
                toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                const urlParams = new URLSearchParams(window.location.search);
                const from = urlParams.get('from') || undefined;
                const redirectPath = from || (userData.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME);
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

    // Thêm useEffect để lắng nghe sự kiện logout
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

    // Thêm useEffect để lắng nghe sự kiện userUpdated
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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

