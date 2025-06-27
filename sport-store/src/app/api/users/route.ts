import { NextRequest, NextResponse } from 'next/server';
import { adminApiClient } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    // Lấy danh sách users từ backend với admin token
    const response = await adminApiClient.get('/users');
    
    if (response.status === 200) {
      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 