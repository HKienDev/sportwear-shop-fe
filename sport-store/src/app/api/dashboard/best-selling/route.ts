import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

// GET /api/dashboard/best-selling
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    const days = searchParams.get('days') || '30';
    const endpoint = `/dashboard/best-selling-products?limit=${limit}&days=${days}`;
    const response = await callBackendAPI(endpoint);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Best selling products error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 