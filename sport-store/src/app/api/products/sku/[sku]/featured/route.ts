import { NextRequest, NextResponse } from 'next/server';
import { callBackendAPI } from '@/utils/apiAuth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;
    const body = await request.json();
    
    console.log('🔄 Updating product featured status:', { sku, body });
    
    // Gọi API backend để cập nhật trạng thái nổi bật
    const response = await callBackendAPI(`/products/${sku}/featured`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Không thể cập nhật trạng thái nổi bật' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('✅ Featured status updated successfully:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in featured status API:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server khi cập nhật trạng thái nổi bật' },
      { status: 500 }
    );
  }
} 