export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem("accessToken");
    console.log("[fetchWithAuth] Access Token ban đầu:", accessToken);

    // Nếu không có accessToken, thử làm mới token
    if (!accessToken) {
        console.warn("Access Token không tồn tại, đang refresh...");
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
            console.error("Refresh Token không hợp lệ, đăng xuất...");
            logout();
            return null;
        }
        accessToken = newAccessToken;
    }

    const headers: HeadersInit = {
        Authorization: `Bearer ${accessToken}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
    };

    options.headers = headers;
    let response = await fetch(url, options);

    console.log("[fetchWithAuth] Response status:", response.status);

    if (response.status === 401) {
        console.warn("Access Token hết hạn, đang refresh...");

        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
            console.error("Refresh Token không hợp lệ, đăng xuất...");
            logout();
            return null;
        }

        console.log("[fetchWithAuth] Access Token mới:", newAccessToken);

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

// Hàm gọi API để refresh Access Token
async function refreshAccessToken(): Promise<string | null> {
    try {
        console.log("[refreshAccessToken] Gọi API refresh...");
        const response = await fetch("http://localhost:4000/api/auth/refresh", {
            method: "POST",
            credentials: "include", // Đọc refreshToken từ cookies
        });

        console.log("[refreshAccessToken] Kết quả:", response.status);

        if (!response.ok) {
            console.error("Refresh Token không hợp lệ:", response.status);
            return null;
        }

        const data = await response.json();
        console.log("[refreshAccessToken] Access Token mới:", data.accessToken);

        if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken); // Lưu accessToken mới
            return data.accessToken;
        }
    } catch (error) {
        console.error("Lỗi kết nối API refresh token:", error);
    }
    return null;
}

// Hàm logout: Xóa token & chuyển hướng trang
export async function logout() {
    localStorage.removeItem("accessToken");

    try {
        await fetch("http://localhost:4000/auth/logout", { // Đảm bảo URL đúng với BE
            method: "POST",
            credentials: "include", // Quan trọng để BE xóa refreshToken
        });
    } catch (error) {
        console.error("Lỗi khi gọi API logout:", error);
    }

    window.location.href = "/user/auth/login"; // Chuyển về trang đăng nhập
}