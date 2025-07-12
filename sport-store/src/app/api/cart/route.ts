import { NextRequest, NextResponse } from 'next/server';

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
        console.log(`🔄 Cart API 409 conflict, retrying... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`🔄 Cart API fetch error, retrying... (attempt ${attempt}/${maxRetries})`);
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
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/cart`;
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
    
    // Debug logs
    console.log('Cart API Response:', {
      success: data.success,
      message: data.message,
      data: data.data,
      items: data.data?.items,
      itemsType: typeof data.data?.items,
      itemsIsArray: Array.isArray(data.data?.items),
      itemsLength: data.data?.items?.length || 0,
      itemDetails: data.data?.items?.map((item: CartItem) => {
        return {
          id: item._id,
          quantity: item.quantity,
          quantityType: typeof item.quantity,
          sku: item.product?.sku,
          color: item.color,
          size: item.size
        };
      })
    });
    
    // Đảm bảo items là array
    if (data.data && !Array.isArray(data.data.items)) {
      console.error('Cart API - Items is not an array:', data.data.items);
      data.data.items = [];
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể lấy giỏ hàng' },
      { status: 500 }
    );
  }
}

 