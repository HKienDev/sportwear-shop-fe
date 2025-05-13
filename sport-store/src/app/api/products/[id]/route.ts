import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Đảm bảo params.id được xử lý đúng cách
    const id = await Promise.resolve(params.id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
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
        'Cache-Control': 'no-cache',
      }
    });
    
    // Log response để debug
    console.log('Response status:', response.status);
    
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
    
    // Parse JSON response
    const data = await response.json();
    console.log('Dữ liệu từ BE:', JSON.stringify(data, null, 2));
    
    // Trả về response từ BE
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 