import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, email } = await request.json();
    
    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại là bắt buộc' },
        { status: 400 }
      );
    }

    // Gọi API backend để kiểm tra số điện thoại và email
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/validate-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, email }),
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error validating phone:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi kiểm tra thông tin' },
      { status: 500 }
    );
  }
} 