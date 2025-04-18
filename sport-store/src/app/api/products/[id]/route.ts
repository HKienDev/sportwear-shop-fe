import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Đảm bảo params.id được xử lý đúng cách
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Use SKU instead of ID for the API endpoint
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`;
    const token = request.cookies.get('token')?.value;
    
    // Add timeout to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Gửi token nếu có, nếu không thì gửi request không có token
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Thử gọi API không có token trước
    let response = await fetch(apiUrl, {
      signal: controller.signal
    });

    // Nếu lỗi 401 và có token, thử lại với token
    if (response.status === 401 && token) {
      response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || 'Không thể tải thông tin sản phẩm' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the exact same format as the backend
    return NextResponse.json({
      success: true,
      message: "Product retrieved successfully",
      data: {
        product: data.data.product
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Không thể tải thông tin sản phẩm' 
      },
      { status: 500 }
    );
  }
} 