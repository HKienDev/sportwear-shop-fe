import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    
    console.log('🔄 Updating order status:', { orderId, body });
    
    // Gọi API backend để cập nhật trạng thái đơn hàng
    const response = await callBackendAPI(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể cập nhật trạng thái đơn hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể cập nhật trạng thái đơn hàng' },
      { status: 500 }
    );
  }
} 