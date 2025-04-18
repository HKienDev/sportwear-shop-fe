import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;
    
    // Lấy token từ cookie của request
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích' },
        { status: 401 }
      );
    }
    
    // Gọi API backend để thêm vào danh sách yêu thích
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/favorites/add`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể thêm sản phẩm vào danh sách yêu thích' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể thêm sản phẩm vào danh sách yêu thích' },
      { status: 500 }
    );
  }
} 