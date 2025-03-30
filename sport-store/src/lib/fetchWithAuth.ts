interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface FetchOptions extends RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Không tìm thấy token");
    }

    const response = await fetch(`http://localhost:4000/api${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Lỗi kết nối đến server");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Lỗi không xác định");
  }
} 