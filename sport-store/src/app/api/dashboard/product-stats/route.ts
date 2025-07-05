import { NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

// GET /api/dashboard/product-stats
export async function GET() {
  try {
    const response = await callBackendAPI('/dashboard/product-stats');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product stats error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 