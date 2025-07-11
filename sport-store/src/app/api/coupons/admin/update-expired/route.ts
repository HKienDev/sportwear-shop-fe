import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('POST update-expired coupons request');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('accessToken')?.value;

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Calling backend update-expired:', 'http://localhost:4000/api/coupons/admin/update-expired');
    const response = await fetch('http://localhost:4000/api/coupons/admin/update-expired', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update expired coupons' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating expired coupons:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 