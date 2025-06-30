import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TOKEN_CONFIG } from '@/config/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(request: Request) {
  try {
    // Lấy access token từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(TOKEN_CONFIG.ACCESS_TOKEN.COOKIE_NAME)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search');

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });

    const response = await fetch(
      `${API_URL}/categories?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch categories');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal Server Error' 
      },
      { status: 500 }
    );
  }
} 