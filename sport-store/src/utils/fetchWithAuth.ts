interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  products?: T[];
  categories?: T[];
  product?: T;
}

export const fetchWithAuth = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");
    console.log("🔹 [fetchWithAuth] Initial token:", token);

    if (!token) {
      console.error("❌ [fetchWithAuth] Không tìm thấy token");
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // Thêm credentials để gửi cookies
    });

    // Log response status và headers
    console.log("🔹 [fetchWithAuth] Response status:", response.status);
    console.log("🔹 [fetchWithAuth] Response headers:", Object.fromEntries(response.headers.entries()));

    // Đọc response body
    const responseData = await response.json().catch(() => null);
    console.log("🔹 [fetchWithAuth] Response data:", responseData);

    // Xử lý các trường hợp lỗi
    if (response.status === 401) {
      // Thử refresh token
      try {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshResponse.ok) {
          throw new Error("Không thể refresh token");
        }

        const refreshData = await refreshResponse.json();
        if (refreshData.accessToken) {
          // Lưu access token mới
          localStorage.setItem("accessToken", refreshData.accessToken);
          
          // Thử gọi lại API với token mới
          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
            credentials: "include",
          });
          
          return await retryResponse.json();
        }
      } catch (refreshError) {
        console.error("❌ [fetchWithAuth] Lỗi refresh token:", refreshError);
      }
      
      console.error("❌ [fetchWithAuth] Token hết hạn hoặc không hợp lệ");
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
      throw new Error(responseData?.message || "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }

    if (response.status === 403) {
      console.error("❌ [fetchWithAuth] Không có quyền truy cập");
      throw new Error(responseData?.message || "Bạn không có quyền truy cập tài nguyên này");
    }

    if (response.status === 404) {
      console.error("❌ [fetchWithAuth] Không tìm thấy tài nguyên");
      throw new Error(responseData?.message || "Không tìm thấy tài nguyên");
    }

    if (response.status === 400) {
      console.error("❌ [fetchWithAuth] Dữ liệu không hợp lệ:", responseData);
      throw new Error(responseData?.message || "Dữ liệu gửi đi không hợp lệ");
    }

    if (!response.ok) {
      console.error("❌ [fetchWithAuth] Lỗi server:", response.status, responseData);
      throw new Error(responseData?.message || "Đã xảy ra lỗi");
    }

    // Nếu response không có success hoặc data, thêm vào
    if (!responseData.success) {
      return {
        success: true,
        data: responseData,
        message: "Thành công"
      };
    }

    return responseData;
  } catch (error) {
    console.error("❌ [fetchWithAuth] Lỗi:", error);
    throw error;
  }
}; 