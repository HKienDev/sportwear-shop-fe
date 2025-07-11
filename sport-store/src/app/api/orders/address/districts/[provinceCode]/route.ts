import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provinceCode: string }> }
) {
  try {
    const { provinceCode } = await params;
    const response = await fetch(`http://localhost:4000/api/orders/address/districts/${provinceCode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể lấy danh sách quận/huyện' },
      { status: 500 }
    );
  }
} 