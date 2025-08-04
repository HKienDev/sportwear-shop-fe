import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { TOKEN_CONFIG } from '@/config/token';

export interface AuthenticatedUser {
  _id: string;
  email: string;
  fullname: string;
  role: string;
  authStatus: string;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    const userCookie = cookieStore.get(TOKEN_CONFIG.USER.COOKIE_NAME)?.value;
    
    if (!accessToken || !userCookie) {
      return null;
    }

    const user = JSON.parse(decodeURIComponent(userCookie));
    return user;
  } catch (error) {
    console.error('❌ API Auth - Error parsing user cookie:', error);
    return null;
  }
}

export async function requireAuth(): Promise<{ user: AuthenticatedUser; accessToken: string } | NextResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;
    const user = await getAuthenticatedUser();
    
    if (!accessToken || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return { user, accessToken };
  } catch (error) {
    console.error('❌ API Auth - Error in requireAuth:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function requireAdmin(): Promise<{ user: AuthenticatedUser; accessToken: string } | NextResponse> {
  try {
    const authResult = await requireAuth();
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user, accessToken } = authResult;
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return { user, accessToken };
  } catch (error) {
    console.error('❌ API Auth - Error in requireAdmin:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function callBackendAPI(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  try {
    let API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Đảm bảo API_URL không kết thúc bằng /api để tránh duplicate
    if (API_URL?.endsWith('/api')) {
      API_URL = API_URL.slice(0, -4); // Loại bỏ /api ở cuối
    }
    
    const authResult = await requireAdmin();
    
    if (authResult instanceof NextResponse) {
      throw new Error('Authentication failed');
    }

    const { accessToken } = authResult;
    // Đảm bảo endpoint không bắt đầu bằng /api để tránh duplicate
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint;
    const url = `${API_URL}/api${cleanEndpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error('❌ callBackendAPI - Backend API error:', { 
        status: response.status, 
        statusText: response.statusText,
        endpoint,
        url
      });
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('❌ callBackendAPI - Error calling backend API:', error);
    throw error;
  }
} 