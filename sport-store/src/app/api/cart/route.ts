import { NextRequest, NextResponse } from 'next/server';

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
    
    // Gọi API backend để lấy giỏ hàng
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/cart`;
    const response = await fetch(apiUrl, {
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
      itemDetails: data.data?.items?.map((item: any) => ({
        id: item._id,
        quantity: item.quantity,
        quantityType: typeof item.quantity,
        sku: item.product?.sku,
        color: item.color,
        size: item.size
      }))
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

 