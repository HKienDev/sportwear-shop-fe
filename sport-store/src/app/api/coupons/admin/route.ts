import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                      request.cookies.get('accessToken')?.value;

        if (!token) {
            console.log('No token found');
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";

        const params = new URLSearchParams({
            page,
            limit,
            ...(search && { search }),
            ...(status && { status }),
        });

        console.log('Calling backend GET:', `http://localhost:4000/api/coupons/admin?${params}`);
        const response = await fetch(`http://localhost:4000/api/coupons/admin?${params}`, {
            method: 'GET',
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

export async function POST(request: NextRequest) {
  try {
    console.log('POST create coupon request');
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('accessToken')?.value;

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    console.log('Calling backend create coupon:', 'http://localhost:4000/api/coupons/admin');
    const response = await fetch('http://localhost:4000/api/coupons/admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create coupon' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 