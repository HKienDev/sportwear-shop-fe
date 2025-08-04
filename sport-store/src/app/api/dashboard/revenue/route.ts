import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

// GET /api/dashboard/revenue
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    
    const response = await callBackendAPI(`/dashboard/revenue?period=${period}`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Revenue API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
} 