import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(request: Request) {
  try {
    // Lấy access token từ header Authorization
    const authHeader = request.headers.get('Authorization');
    let accessToken = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7);
    }
    
    // Nếu không có token trong header, thử lấy từ cookies
    if (!accessToken) {
      const cookieStore = await cookies();
      accessToken = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'accessToken')?.value;
    }

    if (!accessToken) {
      console.error('No access token found in headers or cookies');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const isActive = searchParams.get('isActive');

    // Chuẩn bị query params
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(category && { category }),
      ...(brand && { brand }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(isActive && { isActive })
    });

    // Log request URL for debugging
    const apiUrl = `${API_URL}/products/admin?${queryParams}`;
    console.log('Requesting URL:', apiUrl);
    console.log('Search param value:', search);
    console.log('Access token:', accessToken ? 'Token exists' : 'No token');

    // Kiểm tra API URL
    if (!API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined');
      return NextResponse.json(
        { success: false, message: 'API URL is not configured' },
        { status: 500 }
      );
    }

    // Gửi request đến backend với credentials
    const response = await fetch(
      apiUrl,
      {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Log response status
    console.log('Backend response status:', response.status);

    if (!response.ok) {
      // Thử đọc response body
      let errorMessage = `Backend error: ${response.status}`;
      let errorData: { success?: boolean; message?: string; errors?: Record<string, unknown> } = {};
      
      try {
        const text = await response.text();
        console.log('Error response text:', text);
        
        try {
          errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
          // Nếu không phải JSON, có thể là HTML error page
          if (text.includes('<!DOCTYPE html>')) {
            errorMessage = 'Server returned HTML instead of JSON. Please check server logs.';
          }
        }
      } catch (e) {
        console.error('Failed to read error response body:', e);
      }
      
      console.error('Backend error response:', errorData);
      
      // Nếu backend trả về lỗi 404 (Not Found), trả về thông báo lỗi phù hợp
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: true, 
            message: 'Không có sản phẩm nào',
            data: {
              products: [],
              pagination: {
                total: 0,
                currentPage: parseInt(page),
                totalPages: 0,
                limit: parseInt(limit)
              }
            }
          },
          { status: 200 }
        );
      }
      
      // Trả về lỗi với status code từ backend
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          details: errorData
        },
        { status: response.status }
      );
    }

    // Thử đọc response body
    let data;
    try {
      const text = await response.text();
      console.log('Response text:', text);
      
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          if (text.includes('<!DOCTYPE html>')) {
            return NextResponse.json(
              { 
                success: false, 
                message: 'Server returned HTML instead of JSON',
                details: { text: text.substring(0, 200) + '...' } // Chỉ log 200 ký tự đầu tiên
              },
              { status: 500 }
            );
          }
          return NextResponse.json(
            { 
              success: false, 
              message: 'Invalid JSON response from backend',
              details: { text }
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Empty response from backend'
          },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error('Failed to read response body:', e);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to read response from backend',
          error: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
      );
    }
    
    console.log('Backend response data:', data);
    
    // Trả về dữ liệu từ backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal Server Error',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Lấy access token từ cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'accessToken')?.value;

    if (!accessToken) {
      console.error('No access token found in cookies');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Lấy dữ liệu sản phẩm từ request body
    const productData = await request.json();
    console.log('Creating product with data:', productData);

    // Kiểm tra API URL
    if (!API_URL) {
      console.error('NEXT_PUBLIC_API_URL is not defined');
      return NextResponse.json(
        { success: false, message: 'API URL is not configured' },
        { status: 500 }
      );
    }

    // Gửi request đến backend
    const response = await fetch(
      `${API_URL}/products`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(productData)
      }
    );

    // Log response status
    console.log('Backend response status:', response.status);

    if (!response.ok) {
      // Thử đọc response body
      let errorMessage = `Backend error: ${response.status}`;
      let errorData: { success?: boolean; message?: string; errors?: Record<string, unknown> } = {};
      
      try {
        const text = await response.text();
        console.log('Error response text:', text);
        
        try {
          errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response as JSON:', e);
          if (text.includes('<!DOCTYPE html>')) {
            errorMessage = 'Server returned HTML instead of JSON. Please check server logs.';
          }
        }
      } catch (e) {
        console.error('Failed to read error response body:', e);
      }
      
      console.error('Backend error response:', errorData);
      
      // Nếu backend trả về lỗi 404 (Not Found), trả về thông báo lỗi phù hợp
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            message: errorMessage || 'Không tìm thấy sản phẩm',
            details: errorData
          },
          { status: 404 }
        );
      }
      
      // Trả về lỗi với status code từ backend
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          details: errorData
        },
        { status: response.status }
      );
    }

    // Thử đọc response body
    let data;
    try {
      const text = await response.text();
      console.log('Response text:', text);
      
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          if (text.includes('<!DOCTYPE html>')) {
            return NextResponse.json(
              { 
                success: false, 
                message: 'Server returned HTML instead of JSON',
                details: { text: text.substring(0, 200) + '...' }
              },
              { status: 500 }
            );
          }
          return NextResponse.json(
            { 
              success: false, 
              message: 'Invalid JSON response from backend',
              details: { text }
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Empty response from backend'
          },
          { status: 500 }
        );
      }
    } catch (e) {
      console.error('Failed to read response body:', e);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to read response from backend',
          error: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
      );
    }
    
    console.log('Backend response data:', data);
    
    // Trả về dữ liệu từ backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal Server Error',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
} 