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
      console.log('🔍 API Auth - No tokens found in cookies');
      return null;
    }

    const user = JSON.parse(decodeURIComponent(userCookie));
    console.log('✅ API Auth - User authenticated:', { id: user._id, role: user.role });
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
      console.log('❌ API Auth - Authentication required but not provided');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ API Auth - User authenticated successfully');
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
      console.log('❌ API Auth - User is not admin:', { userId: user._id, role: user.role });
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.log('✅ API Auth - Admin access granted:', { userId: user._id });
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
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const authResult = await requireAdmin();
    
    if (authResult instanceof NextResponse) {
      throw new Error('Authentication failed');
    }

    const { accessToken } = authResult;
    const url = `${API_URL}${endpoint}`;
    
    console.log('🌐 API Auth - Calling backend:', { endpoint, method: options.method || 'GET' });

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error('❌ API Auth - Backend API error:', { 
        status: response.status, 
        statusText: response.statusText,
        endpoint 
      });
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    console.log('✅ API Auth - Backend API call successful:', { endpoint, status: response.status });
    return response;
  } catch (error) {
    console.error('❌ API Auth - Error calling backend API:', error);
    throw error;
  }
} 