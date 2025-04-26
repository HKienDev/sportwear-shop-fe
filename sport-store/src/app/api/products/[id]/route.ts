import { NextRequest, NextResponse } from 'next/server';

// Sử dụng biến môi trường hoặc URL mặc định
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Đảm bảo params.id được xử lý đúng cách
    const id = params?.id;
    
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
    
    // Tạo URL API với SKU
    const apiUrl = `${API_URL}/products/sku/${id}`;
    
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
          message: 'Lỗi định dạng dữ liệu từ server' 
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('Dữ liệu từ BE:', data);

    // Trả về response từ BE
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Lỗi khi gọi API BE:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi server' 
      },
      { status: 500 }
    );
  }
} 