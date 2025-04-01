import axios, { AxiosError } from 'axios';
import { API_URL } from '@/config/constants';
import type { 
    ApiResponse, 
    PaginatedResponse,
    ProductQueryParams,
    OrderQueryParams
} from '@/types/api';
import type {
    Product,
    Category,
    Order,
    UploadResponse,
    CartItem,
    CreateProductData,
    UpdateProductData,
    CreateOrderData,
    UpdateOrderData
} from '@/types/base';
import type {
    LoginResponse,
    VerifyOTPRequest,
    UpdateProfileRequest,
    GoogleAuthResponse,
    ProfileResponse,
    AuthCheckResponse,
    TokenVerifyResponse,
    EmptyResponse
} from '@/types/auth';
import type { AxiosResponse } from 'axios';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Tạo instance Axios
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000,
    validateStatus: (status) => status >= 200 && status < 500
});

// Flag để kiểm soát việc refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: Error) => void;
}> = [];

// Rate limiting cho refresh token
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 5000; // 5 giây
const MAX_REFRESH_ATTEMPTS = 3; // Số lần thử refresh tối đa
let refreshAttempts = 0;

// Rate limiting cho auth check
let lastAuthCheck = 0;
const AUTH_CHECK_COOLDOWN = 5000; // 5 giây

const canRefresh = () => {
    const now = Date.now();
    if (now - lastRefreshTime < REFRESH_COOLDOWN) {
        return false;
    }
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        return false;
    }
    lastRefreshTime = now;
    refreshAttempts++;
    return true;
};

const canCheckAuth = () => {
    const now = Date.now();
    if (now - lastAuthCheck < AUTH_CHECK_COOLDOWN) {
        return false;
    }
    lastAuthCheck = now;
    return true;
};

const resetRefreshAttempts = () => {
    refreshAttempts = 0;
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Request:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                data: config.data
            });
        }
        return config;
    },
    (error) => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Request Error:', error);
        }
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
        }
        return response;
    },
    async (error: AxiosError) => {
        if (process.env.NODE_ENV === 'development') {
            console.error('Response Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }

        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Xử lý lỗi mạng
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject(error);
        }

        // Xử lý lỗi 401
        if (error.response.status === 401) {
            // Nếu đang refresh token, đưa request vào hàng đợi
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).catch((err: unknown) => {
                    failedQueue = [];
                    isRefreshing = false;
                    throw err instanceof Error ? err : new Error('Unknown error occurred');
                });
            }

            // Kiểm tra rate limit và số lần thử refresh
            if (!canRefresh()) {
                console.warn('Refresh token limit exceeded, redirecting to login...');
                // Xóa cookies và localStorage
                document.cookie.split(';').forEach(cookie => {
                    const [name] = cookie.split('=');
                    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
                localStorage.removeItem('user');
                window.location.replace('/auth/login');
                throw new Error('Refresh token limit exceeded');
            }

            isRefreshing = true;

            try {
                const response = await api.post('/auth/refresh-token');
                isRefreshing = false;
                resetRefreshAttempts();

                if (response.data.success) {
                    // Xử lý các request đang chờ
                    failedQueue.forEach((prom) => {
                        try {
                            prom.resolve(api(originalRequest));
                        } catch (err) {
                            prom.reject(err instanceof Error ? err : new Error('Unknown error occurred'));
                        }
                    });
                    failedQueue = [];
                    return api(originalRequest);
                }
            } catch (refreshError) {
                isRefreshing = false;
                failedQueue = [];
                // Xóa cookies và localStorage khi refresh token thất bại
                document.cookie.split(';').forEach(cookie => {
                    const [name] = cookie.split('=');
                    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
                localStorage.removeItem('user');
                window.location.replace('/auth/login');
                throw refreshError;
            }
        }

        // Xử lý lỗi 429 (Too Many Requests)
        if (error.response.status === 429) {
            console.warn('Rate limit exceeded, please try again later');
            throw new Error('Rate limit exceeded');
        }

        return Promise.reject(error);
    }
);

// API methods
const apiClient = {
    // Auth
    auth: {
        login: async (email: string, password: string) => {
            try {
                const response = await api.post<ApiResponse<LoginResponse['data']>>('/auth/login', { email, password });
                if (response.data.success && response.data.data) {
                    // Reset refresh attempts khi login thành công
                    resetRefreshAttempts();
                    // Lưu thông tin user vào localStorage và cookie
                    const userData = response.data.data.user;
                    localStorage.setItem('user', JSON.stringify(userData));
                    document.cookie = `user=${JSON.stringify(userData)}; path=/;`;
                    
                    // Chuyển hướng dựa vào role
                    if (userData.role === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                }
                return response;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        register: async (data: { email: string; password: string; name: string }) => {
            return api.post<ApiResponse<LoginResponse['data']>>('/auth/register', data);
        },
        logout: async () => {
            try {
                const response = await api.post<ApiResponse<EmptyResponse['data']>>('/auth/logout');
                // Xóa cookies và localStorage ngay cả khi API trả về lỗi
                document.cookie.split(';').forEach(cookie => {
                    const [name] = cookie.split('=');
                    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
                localStorage.clear();
                return response;
            } catch (error) {
                // Xóa cookies và localStorage ngay cả khi API trả về lỗi
                document.cookie.split(';').forEach(cookie => {
                    const [name] = cookie.split('=');
                    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });
                localStorage.clear();
                throw error;
            }
        },
        forgotPassword: async (email: string) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/forgot-password', { email });
        },
        resetPassword: async (token: string, password: string) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/reset-password', { token, password });
        },
        verifyOTP: async (data: VerifyOTPRequest) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/verify-otp', data);
        },
        resendOTP: async (email: string) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/resend-otp', { email });
        },
        updateProfile: async (data: UpdateProfileRequest) => {
            return api.put<ApiResponse<ProfileResponse['data']>>('/auth/profile', data);
        },
        changePassword: async (data: { currentPassword: string; newPassword: string }) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/change-password', data);
        },
        googleAuth: async () => {
            return api.get<ApiResponse<{ url: string }>>('/auth/google');
        },
        googleCallback: async (code: string) => {
            return api.get<ApiResponse<GoogleAuthResponse['data']>>(`/auth/google/callback?code=${code}`);
        },
        verifyAccount: async (data: VerifyOTPRequest) => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/verify-account', data);
        },
        requestUpdate: async () => {
            return api.post<ApiResponse<EmptyResponse['data']>>('/auth/request-update');
        },
        updateUser: async (data: UpdateProfileRequest) => {
            return api.put<ApiResponse<ProfileResponse['data']>>('/auth/user', data);
        },
        getProfile: async () => {
            return api.get<ApiResponse<ProfileResponse['data']>>('/auth/profile');
        },
        verifyToken: async () => {
            return api.get<ApiResponse<TokenVerifyResponse['data']>>('/auth/verify-token');
        },
        checkAuth: async () => {
            // Kiểm tra xem có nên gọi API không
            if (!canCheckAuth()) {
                return Promise.reject(new Error('Auth check cooldown'));
            }
            // Kiểm tra xem có user trong localStorage không
            const user = localStorage.getItem('user');
            if (!user) {
                return Promise.reject(new Error('No user found'));
            }
            return api.get<AuthCheckResponse>('/auth/check');
        },
        refreshToken: async () => {
            return api.post<ApiResponse<LoginResponse['data']>>('/auth/refresh-token');
        }
    },

    // Products
    products: {
        getAll: (params?: ProductQueryParams): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Product>>>> =>
            api.get(`/products`, { params }),
        
        getById: (id: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.get(`/products/${id}`),
        
        create: (data: CreateProductData): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.post(`/products`, data),
        
        update: (id: string, data: UpdateProductData): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.put(`/products/${id}`, data),
        
        delete: (id: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
            api.delete(`/products/${id}`)
    },

    // Categories
    categories: {
        getAll: (): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
            api.get(`/categories`),
        
        getById: (id: string): Promise<AxiosResponse<ApiResponse<Category>>> =>
            api.get(`/categories/${id}`),
        
        create: (data: { name: string; slug: string; parentId?: string }): Promise<AxiosResponse<ApiResponse<Category>>> =>
            api.post(`/categories`, data),
        
        update: (id: string, data: { name: string; slug: string; parentId?: string }): Promise<AxiosResponse<ApiResponse<Category>>> =>
            api.put(`/categories/${id}`, data),
        
        delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
            api.delete(`/categories/${id}`)
    },

    // Orders
    orders: {
        getAll: (params?: OrderQueryParams): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Order>>>> =>
            api.get(`/orders`, { params }),
        
        getById: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
            api.get(`/orders/${id}`),
        
        create: (data: CreateOrderData): Promise<AxiosResponse<ApiResponse<Order>>> =>
            api.post(`/orders`, data),
        
        update: (id: string, data: UpdateOrderData): Promise<AxiosResponse<ApiResponse<Order>>> =>
            api.put(`/orders/${id}`, data),
        
        delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
            api.delete(`/orders/${id}`)
    },

    // Upload
    upload: {
        uploadFile: (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return api.post<ApiResponse<UploadResponse>>('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
    },

    // Cart
    cart: {
        getCart: (): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
            api.get(`/cart`),
        
        addToCart: (productId: string, quantity: number): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
            api.post(`/cart`, { productId, quantity }),
        
        updateCart: (productId: string, quantity: number): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
            api.put(`/cart/${productId}`, { quantity }),
        
        removeFromCart: (productId: string): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
            api.delete(`/cart/${productId}`),
        
        clearCart: (): Promise<AxiosResponse<ApiResponse<CartItem[]>>> =>
            api.delete(`/cart`)
    }
};

export default apiClient;