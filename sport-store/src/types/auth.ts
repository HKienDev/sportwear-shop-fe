import type { User } from './base';

export type AuthUser = User & {
    role: 'admin' | 'user';
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt?: string;
};

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
    data?: AuthResponseData;
    message?: string;
}

export interface AuthCheckResponse {
    success: boolean;
    user?: AuthUser;
    message?: string;
}

export interface TokenVerifyResponse {
    data?: {
        user: AuthUser;
    };
    message?: string;
}

export interface ProfileResponse {
    data?: {
        user: AuthUser;
    };
    message?: string;
}

export interface EmptyResponse {
    data?: null;
    message?: string;
}

export interface GoogleAuthResponse {
    data?: AuthResponseData;
    message?: string;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
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
} 