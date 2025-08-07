import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backendUrl';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing cart API connection...');
    
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
  
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }
    
    // Test kết nối với backend
    const apiUrl = getBackendUrl("/cart");
    console.log('🌐 Testing backend URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    

    
    if (!response.ok) {
      const errorData = await response.json();
  
      return NextResponse.json(
        { success: false, message: errorData.message || 'Backend connection failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();

    return NextResponse.json({ success: true, message: 'Backend connection successful', data });
  } catch (error: unknown) {
    console.error('❌ Test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Test failed', error: errorMessage },
      { status: 500 }
    );
  }
} 