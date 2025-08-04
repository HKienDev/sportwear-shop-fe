import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing cart API connection...');
    
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token found in test');
      return NextResponse.json(
        { success: false, message: 'No token found' },
        { status: 401 }
      );
    }
    
    // Test kết nối với backend
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/cart`;
    console.log('🌐 Testing backend URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Test response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Test failed:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Backend connection failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Test successful:', data);
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