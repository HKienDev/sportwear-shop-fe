import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from "@/utils/api";

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json();
    
    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin đơn hàng hoặc số tiền' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = await cookieStore.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId, amount })
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