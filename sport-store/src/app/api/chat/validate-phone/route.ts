import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function POST(request: NextRequest) {
  try {
    const { phone, email } = await request.json();
    
    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'Phone hoặc email là bắt buộc' },
        { status: 400 }
      );
    }

    // Gọi backend API để kiểm tra
    const apiUrl = getBackendUrl('/users/check-exists');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phone: phone?.trim() || '',
        email: email?.trim() || ''
      }),
    });

    if (!response.ok) {
      console.error('❌ Backend validation error:', response.status);
      return NextResponse.json(
        { success: false, message: 'Lỗi kiểm tra thông tin' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (data.exists) {
      return NextResponse.json({
        success: true,
        isUsed: true,
        message: data.message || 'Email hoặc số điện thoại đã được sử dụng'
      });
    }

    return NextResponse.json({
      success: true,
      isUsed: false,
      message: 'Thông tin hợp lệ'
    });

  } catch (error) {
    console.error('❌ Chat validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server' },
      { status: 500 }
    );
  }
} 