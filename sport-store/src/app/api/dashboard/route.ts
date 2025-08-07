import { NextResponse } from 'next/server';
import { callBackendAPIWithAuth } from '@/utils/apiAuth';

// GET /api/dashboard/stats
export async function GET() {
  try {
    const response = await callBackendAPIWithAuth('/dashboard/stats');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 