import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from "@/utils/api";
import { TOKEN_CONFIG } from "@/config/token";

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json();
    
    if (!amount) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin số tiền' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = await cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    
    console.log('Cookie name:', TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME);
    console.log('Token found:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'null');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Nếu có orderId, gửi cả orderId và amount
    // Nếu không có orderId, chỉ gửi amount
    const requestBody = orderId ? { orderId, amount } : { amount };

    const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error from backend:', data);
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Có lỗi xảy ra khi tạo phiên thanh toán' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      clientSecret: data.clientSecret
    });
  } catch (error) {
    console.error('Error in create-payment-intent:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi hệ thống, vui lòng thử lại sau' 
      },
      { status: 500 }
    );
  }
} 