import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "active";

    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(status && { status }),
    });

    console.log('Calling backend GET:', `http://localhost:4000/api/coupons?${params}`);
    const response = await fetch(`http://localhost:4000/api/coupons?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch coupons' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 