import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';
import { getBackendUrl } from '@/utils/backendUrl';

export async function POST() {
  try {
    // Lấy access token từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }

    // Gọi API backend để logout
    const backendUrl = getBackendUrl('/auth/logout');

    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });



    if (!response.ok) {
      const errorData = await response.json();
      console.error('🔍 Logout API - Backend error:', errorData);
      
      // If token is expired, that's actually fine for logout
      if (response.status === 401 && errorData.message?.includes('Token đã hết hạn')) {
  
        return NextResponse.json(
          { success: true, message: 'Đăng xuất thành công' },
          { status: 200 }
        );
      }
      
      throw new Error(errorData.message || 'Failed to logout');
    }

    const data = await response.json();


    // Tạo response với cookies cleared
    const responseData = NextResponse.json(data);
    
    // Clear cookies
    responseData.cookies.set(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME, '', {
      path: '/',
      expires: new Date(0),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    responseData.cookies.set(TOKEN_CONFIG.REFRESH_TOKEN.COOKIE_NAME, '', {
      path: '/',
      expires: new Date(0),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    responseData.cookies.set(TOKEN_CONFIG.USER.COOKIE_NAME, '', {
      path: '/',
      expires: new Date(0),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return responseData;
  } catch (error: unknown) {
    console.error('Error in logout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage
      },
      { status: 500 }
    );
  }
} 