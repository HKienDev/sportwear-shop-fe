import { TOKEN_CONFIG } from '@/config/token';
import { API_URL } from "@/utils/api";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    fullname: string;
    avatar: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    membershipLevel: string;
    totalSpent: number;
    orderCount: number;
  };
}

// Hàng đợi các request bị lỗi 401
let failedRequestsQueue: (() => void)[] = [];
let isRefreshing = false;

// Timeout cho mỗi request (30 giây)
const REQUEST_TIMEOUT = 30000;

// Lấy token từ cookie
function getTokenFromCookie(): string | null {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=`))
    ?.split('=')[1] || null;
  
  console.log('🔍 fetchWithAuth - Token from cookie:', {
    cookieName: TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME,
    hasToken: !!token,
    tokenLength: token?.length,
    allCookies: document.cookie.split('; ').map(c => c.split('=')[0])
  });
  
  return token;
}

// Lấy token từ localStorage
function getTokenFromStorage(): string | null {
  const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
  console.log('🔍 fetchWithAuth - Token from storage:', {
    key: TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY,
    hasToken: !!token,
    tokenLength: token?.length
  });
  return token;
}

// Cập nhật token vào cả cookie và localStorage
function updateToken(token: string): void {
  localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, token);
  document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
  console.log('💾 fetchWithAuth - Token updated:', {
    storageKey: TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY,
    cookieName: TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME,
    tokenLength: token.length
  });
}

// Xóa token khỏi cả cookie và localStorage
function removeToken(): void {
  localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
  document.cookie = `${TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

async function refreshToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN.STORAGE_KEY);
    if (!refreshToken) {
      throw new Error("Không tìm thấy refresh token");
    }

    const response = await fetch(`/api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Không thể làm mới token");
    }

    if (data.success && data.data?.accessToken) {
      updateToken(data.data.accessToken);
      return data.data.accessToken;
    }

    throw new Error("Token không hợp lệ");
  } catch (error) {
    console.error("Lỗi khi làm mới token:", error);
    removeToken();
    return null;
  }
}

export const fetchWithAuth = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // Kiểm tra token từ cookie trước
    let token = getTokenFromCookie();
    
    // Nếu không có token trong cookie, kiểm tra localStorage
    if (!token) {
      token = getTokenFromStorage();
      // Nếu có token trong localStorage, cập nhật vào cookie
      if (token) {
        updateToken(token);
      } else {
        throw new Error("Vui lòng đăng nhập để tiếp tục");
      }
    }

    // Tạo AbortController cho timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    // Thiết lập headers mặc định
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      [TOKEN_CONFIG.ACCESS_TOKEN.HEADER_KEY]: `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${token}`,
      ...options.headers,
    };

    // Xử lý URL: nếu endpoint bắt đầu bằng /api thì gọi Next.js API routes
    // Nếu không thì gọi backend API
    let fullUrl: string;
    if (endpoint.startsWith('/api')) {
      // Next.js API routes - không thêm base URL
      fullUrl = endpoint;
    } else if (endpoint.startsWith('http')) {
      // Absolute URL
      fullUrl = endpoint;
    } else {
      // Backend API - thêm API_URL
      fullUrl = `${API_URL}${endpoint}`;
    }

    console.log('🔍 fetchWithAuth - Request details:', {
      endpoint,
      fullUrl,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenLength: token?.length,
      headers: Object.keys(headers),
      isNextJSAPI: endpoint.startsWith('/api'),
      isBackendAPI: !endpoint.startsWith('/api') && !endpoint.startsWith('http')
    });

    // Gọi API với timeout
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal,
      credentials: 'include',
    });

    clearTimeout(timeout);

    // Kiểm tra content-type
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content-type:", contentType, "for URL:", fullUrl);
      throw new Error("Server trả về dữ liệu không hợp lệ");
    }

    let responseData: ApiResponse<T>;
    try {
      responseData = await response.json();
    } catch (error) {
      console.error("Lỗi khi parse JSON:", error);
      throw new Error("Không thể đọc dữ liệu từ server");
    }

    // Xử lý lỗi 401 (Unauthorized)
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          if (!newToken) {
            throw new Error("Phiên đăng nhập đã hết hạn");
          }

          // Thêm token mới vào header
          headers[TOKEN_CONFIG.ACCESS_TOKEN.HEADER_KEY] = `${TOKEN_CONFIG.ACCESS_TOKEN.PREFIX} ${newToken}`;

          // Thực hiện lại request với token mới
          const retryResponse = await fetch(fullUrl, {
            ...options,
            headers,
            credentials: 'include',
          });

          // Kiểm tra content-type của response retry
          const retryContentType = retryResponse.headers.get("content-type");
          if (!retryContentType || !retryContentType.includes("application/json")) {
            console.error("Invalid content-type for retry:", retryContentType, "for URL:", fullUrl);
            throw new Error("Server trả về dữ liệu không hợp lệ");
          }

          let retryData: ApiResponse<T>;
          try {
            retryData = await retryResponse.json();
          } catch (error) {
            console.error("Lỗi khi parse JSON từ retry:", error);
            throw new Error("Không thể đọc dữ liệu từ server");
          }

          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Không thể kết nối đến server");
          }

          // Xử lý các request đang chờ
          failedRequestsQueue.forEach((callback) => callback());
          failedRequestsQueue = [];
          isRefreshing = false;

          return retryData;
        } catch (error) {
          isRefreshing = false;
          if (error instanceof Error && error.message.includes("Phiên đăng nhập đã hết hạn")) {
            window.dispatchEvent(new CustomEvent('logout'));
          }
          throw error;
        }
      } else {
        // Nếu đang refresh, thêm request vào queue
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          failedRequestsQueue.push(() => {
            fetchWithAuth<T>(endpoint, options)
              .then(resolve)
              .catch(reject);
          });
        });
      }
    }

    // Xử lý các lỗi khác
    if (!response.ok) {
      throw new Error(responseData.message || "Không thể kết nối đến server");
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Vui lòng thử lại.");
      }
      throw error;
    }
    throw new Error("Có lỗi xảy ra khi kết nối đến server");
  }
};

// Helper function để gọi API Next.js với token
export async function fetchWithAuthNextJS(input: RequestInfo, init: RequestInit = {}) {
  let token: string | null = null;
  // Ưu tiên lấy từ localStorage, fallback sang cookie nếu cần
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
    if (!token) {
      // Lấy từ cookie nếu cần
      const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
      if (match) token = decodeURIComponent(match[1]);
    }
  }
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  return fetch(input, { ...init, headers });
}