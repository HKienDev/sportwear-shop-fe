import { NextRequest, NextResponse } from 'next/server';

// Sử dụng biến môi trường hoặc URL mặc định
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Đảm bảo params.id được xử lý đúng cách
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Thiếu mã sản phẩm (ID)' 
        },
        { status: 400 }
      );
    }

    console.log(`Đang gọi API BE với ID: ${id}`);
    
    // Kiểm tra xem id có phải là SKU không (bắt đầu bằng VJUSPORTPRODUCT-)
    const isSku = id.startsWith('VJUSPORTPRODUCT-');
    const apiUrl = isSku 
      ? `${API_URL}/products/sku/${id}`
      : `${API_URL}/products/${id}`;
    
    console.log(`URL: ${apiUrl}`);
    
    // Gọi API BE với endpoint phù hợp
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Log response để debug
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Kiểm tra nếu response không phải là JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response không phải là JSON:', contentType);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu trả về không hợp lệ',
          error: 'Response không phải là JSON'
        },
        { status: 500 }
      );
    }
    
    // Lấy dữ liệu từ response
    const data = await response.json();
    console.log('Dữ liệu từ BE:', data);
    
    // Kiểm tra lỗi 401
    if (response.status === 401) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Không có quyền truy cập. Vui lòng đăng nhập để xem thông tin sản phẩm.',
          error: data
        },
        { status: 401 }
      );
    }
    
    // Kiểm tra lỗi 404
    if (response.status === 404) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Không tìm thấy sản phẩm với ID này',
          error: data
        },
        { status: 404 }
      );
    }
    
    // Kiểm tra cấu trúc dữ liệu
    if (!data || !data.success || !data.data || !data.data.product) {
      console.error('Cấu trúc dữ liệu không hợp lệ:', data);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Dữ liệu sản phẩm không hợp lệ',
          error: 'Invalid data structure'
        },
        { status: 500 }
      );
    }
    
    // Trả về dữ liệu với cấu trúc chuẩn
    return NextResponse.json({
      success: true,
      data: data.data.product
    });
  } catch (error) {
    console.error('Lỗi khi gọi API BE:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Không thể tải thông tin sản phẩm',
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi'
      },
      { status: 500 }
    );
  }
} 