import { getAuthToken } from '@/utils/token';
import { TOKEN_CONFIG } from '@/config/token';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const fetchApi = async (endpoint: string, options: FetchOptions = {}) => {
  try {
    const { requireAuth = true, ...fetchOptions } = options;
    // Loại bỏ /api prefix nếu endpoint đã có
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint;
    const url = `${API_URL}${cleanEndpoint}`;
    
    // Chuẩn bị headers
    const headers = new Headers(fetchOptions.headers || {});
    
    // Thêm Content-Type nếu chưa có và có body
    if (fetchOptions.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    if (requireAuth) {
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('Vui lòng đăng nhập lại');
      }
      
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Merge headers với options
    const finalOptions: RequestInit = {
      ...fetchOptions,
      headers
    };

    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      // Kiểm tra nếu token hết hạn
      if (response.status === 401) {
        // Xóa token cũ
        localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }
      
      // Trả về response data để component có thể xử lý lỗi
      return {
        success: false,
        message: data?.message || 'Có lỗi xảy ra',
        ...data
      };
    }

    return {
      success: true,
      ...data
    };

  } catch (error) {
    console.error('❌ API Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'
    };
  }
};

// Upload file với progress tracking
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; message?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    
    // Wrap XHR in a Promise
    const uploadPromise = new Promise<{ success: boolean; url?: string; message?: string }>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              url: response.url,
            });
          } catch {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || error.message || 'Upload failed'));
          } catch {
            reject(new Error('Upload failed'));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });
    });

    // Start upload
    xhr.open('POST', `${API_URL}/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);

    return await uploadPromise;

  } catch (error) {
    console.error('❌ Upload Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload file'
    };
  }
};