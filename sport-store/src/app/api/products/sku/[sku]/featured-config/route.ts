import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const body = await request.json();
    
    console.log('🔄 Setting up featured config for SKU:', sku);
    console.log('📝 Config data:', body);
    
    // Validate required fields
    const { countdownEndDate, soldCount, remainingStock, isActive } = body;
    
    if (!countdownEndDate) {
      return NextResponse.json(
        { success: false, message: 'Thời gian kết thúc là bắt buộc' },
        { status: 400 }
      );
    }
    
    if (typeof soldCount !== 'number' || soldCount < 0) {
      return NextResponse.json(
        { success: false, message: 'Số lượng đã bán không hợp lệ' },
        { status: 400 }
      );
    }
    
    if (typeof remainingStock !== 'number' || remainingStock < 0) {
      return NextResponse.json(
        { success: false, message: 'Số lượng còn lại không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Call backend API
    const response = await callBackendAPI(`/products/sku/${sku}/featured-config`, {
      method: 'PATCH',
      body: JSON.stringify({
        countdownEndDate,
        soldCount,
        remainingStock,
        isActive
      })
    });
    
    const responseData = await response.json();
    
    if (!response.ok || !responseData.success) {
      console.error('❌ Backend API error:', responseData);
      return NextResponse.json(
        { success: false, message: responseData.message || 'Không thể setup countdown' },
        { status: 400 }
      );
    }
    
    console.log('✅ Featured config setup successfully');
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('❌ Error in featured config API:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi setup countdown' },
      { status: 500 }
    );
  }
} 