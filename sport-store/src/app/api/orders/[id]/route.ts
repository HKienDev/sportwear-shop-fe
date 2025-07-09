import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    
    console.log('🔄 Getting order details:', orderId);
    
    // Gọi API backend để lấy chi tiết đơn hàng
    const response = await callBackendAPI(`/orders/${orderId}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể lấy chi tiết đơn hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Order details retrieved successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error getting order details:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể lấy chi tiết đơn hàng' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    
    console.log('🔄 Updating order:', { orderId, body });
    
    // Gọi API backend để cập nhật đơn hàng
    const response = await callBackendAPI(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể cập nhật đơn hàng' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Order updated successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error updating order:', error);
    return NextResponse.json(
      { success: false, message: 'Không thể cập nhật đơn hàng' },
      { status: 500 }
    );
  }
} 