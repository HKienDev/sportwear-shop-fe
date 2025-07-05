import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

// GET /api/dashboard/revenue
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day';
    
    const response = await callBackendAPI(`/dashboard/revenue?period=${period}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Revenue stats error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 