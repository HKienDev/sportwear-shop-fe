import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

// GET /api/dashboard/recent-orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '2';
    const endpoint = `/dashboard/recent-orders?page=${page}&limit=${limit}`;
    const response = await callBackendAPI(endpoint);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Recent orders error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 