export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
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
    });

    // Log response status và headers
    console.log("🔹 [fetchWithAuth] Response status:", response.status);
    console.log("🔹 [fetchWithAuth] Response headers:", Object.fromEntries(response.headers.entries()));

    // Xử lý các trường hợp lỗi
    if (response.status === 401) {
      console.error("❌ [fetchWithAuth] Token hết hạn hoặc không hợp lệ");
      localStorage.removeItem("accessToken");
      throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }

    if (response.status === 403) {
      console.error("❌ [fetchWithAuth] Không có quyền truy cập");
      // Xóa token cũ và chuyển hướng về trang login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Bạn không có quyền truy cập tài nguyên này");
    }

    if (response.status === 404) {
      console.error("❌ [fetchWithAuth] Không tìm thấy tài nguyên");
      throw new Error("Không tìm thấy tài nguyên");
    }

    if (!response.ok) {
      console.error("❌ [fetchWithAuth] Lỗi server:", response.status);
      throw new Error("Đã xảy ra lỗi");
    }

    return response;
  } catch (error) {
    console.error("❌ [fetchWithAuth] Lỗi:", error);
    throw error;
  }
}; 