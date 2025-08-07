import { NextRequest, NextResponse } from 'next/server';
import { logInfo, logDebug, logError } from '@/utils/logger';
import { getBackendUrl } from '@/utils/backendUrl';

// Interface cho cart item
interface CartItem {
  _id: string;
  quantity: number;
  product?: {
    sku?: string;
  };
  color?: string;
  size?: string;
}

// Retry function for handling 409 conflicts
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If it's a 409 conflict and we haven't exhausted retries, wait and retry
      if (response.status === 409 && attempt < maxRetries) {
        logInfo(`🔄 Cart API 409 conflict, retrying... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      logInfo(`🔄 Cart API fetch error, retrying... (attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error('Max retries exceeded');
}

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để xem giỏ hàng' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để lấy giỏ hàng với retry logic
    const apiUrl = getBackendUrl('/cart');
    const response = await fetchWithRetry(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể lấy giỏ hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Debug logs - chỉ log khi có items hoặc lỗi
    if (data.data?.items?.length > 0 || !data.success) {
      logInfo('Cart API Response:', {
        success: data.success,
        message: data.message,
        itemsCount: data.data?.items?.length || 0,
        hasItems: Array.isArray(data.data?.items) && data.data.items.length > 0
      });
    }
    
    // Đảm bảo items là array
    if (data.data && !Array.isArray(data.data.items)) {
      logError('Cart API - Items is not an array:', data.data.items);
      data.data.items = [];
    }
    
    return NextResponse.json(data);
  } catch (error) {
    logError('Error getting cart:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể lấy giỏ hàng' },
      { status: 500 }
    );
  }
}

 