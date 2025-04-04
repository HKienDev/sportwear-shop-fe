import { TOKEN_CONFIG } from '@/config/token';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
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

let isRefreshing = false; // Biến cờ để kiểm soát việc làm mới token
let failedRequestsQueue: Array<() => void> = []; // Hàng đợi các request thất bại do token hết hạn

async function refreshToken(): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.accessToken) {
      return data.accessToken;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
  return null;
}

export const fetchWithAuth = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);

    if (!token) {
      throw new Error("Vui lòng đăng nhập để tiếp tục");
    }

    // Tạo headers mặc định
    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Merge headers mặc định với headers tùy chọn
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    // Gọi API với token
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    // Đọc response body
    const responseData = await response.json().catch(() => null);

    // Xử lý các trường hợp lỗi
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        // Thử refresh token
        const newToken = await refreshToken();
        if (!newToken) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        }

        // Lưu token mới vào localStorage
        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY, newToken);

        // Cập nhật token cho các request trong hàng đợi
        failedRequestsQueue.forEach((callback) => callback());
        failedRequestsQueue = [];
        isRefreshing = false;

        // Gọi lại API với token mới
        return fetchWithAuth<T>(endpoint, options);
      } else {
        // Nếu đang làm mới token, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push(async () => {
            try {
              resolve(await fetchWithAuth<T>(endpoint, options));
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    }

    if (!response.ok) {
      throw new Error(responseData?.message || "Không thể kết nối đến server");
    }

    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      // Nếu lỗi liên quan đến xác thực, dispatch event logout
      if (error.message.includes("Phiên đăng nhập đã hết hạn")) {
        window.dispatchEvent(new CustomEvent('logout'));
      }
      throw new Error(error.message);
    }
    throw new Error("Có lỗi xảy ra khi gọi API");
  }
};