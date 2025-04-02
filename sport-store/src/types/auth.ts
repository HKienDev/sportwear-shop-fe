import type { User } from './base';

export interface AuthUser extends User {
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface UpdateProfileRequest {
    fullname?: string;
    phone?: string;
    address?: {
        street?: string;
        ward?: string;
        district?: string;
        province?: string;
    };
    avatar?: string;
}

export interface AuthResponseData {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    data?: AuthResponseData;
}

export interface AuthCheckResponse {
    success: boolean;
    message?: string;
    user?: AuthUser;
}

export interface TokenVerifyResponse {
    success: boolean;
    message?: string;
    data?: {
        user: AuthUser;
    };
}

export interface ProfileResponse {
    success: boolean;
    message?: string;
    data?: {
        user: AuthUser;
    };
}

export interface EmptyResponse {
    success: boolean;
    message?: string;
    data?: null;
}

export interface GoogleAuthResponse {
    success: boolean;
    message?: string;
    data?: AuthResponseData;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (data: LoginRequest) => Promise<LoginResponse>;
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

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
    confirmPassword: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
        user: AuthUser;
        token: string;
    };
} 