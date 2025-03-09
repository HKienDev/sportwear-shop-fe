export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem("accessToken");

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.warn("⚠️ Access Token hết hạn, đang refresh...");

      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        console.error("🚨 Refresh Token không hợp lệ, đăng xuất...");
        logout(); // <--- Gọi logout nếu refresh token không hợp lệ
        return null;
      }

      // Cập nhật token mới và thử lại request
      accessToken = newAccessToken;
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      response = await fetch(url, options);
    }

    return response;
}

// 🌀 Hàm gọi API để refresh Access Token
async function refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Gửi cookie refreshToken
      });

      if (!response.ok) {
        console.error("❌ Lỗi khi refresh token:", response.status);
        return null;
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error("❌ Lỗi kết nối API refresh token:", error);
      return null;
    }
}

// 🔴 Hàm logout: Xóa token & chuyển hướng trang
export function logout() {  // <--- Thêm export ở đây
    localStorage.removeItem("accessToken");
    document.cookie = "refreshToken=; Max-Age=0; path=/"; // Xóa cookie refreshToken
    window.location.href = "/user/auth/login"; // Chuyển về trang đăng nhập
}