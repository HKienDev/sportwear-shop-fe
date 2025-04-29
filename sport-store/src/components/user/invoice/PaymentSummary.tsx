interface PaymentSummaryProps {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shipping: number;
  total: number;
  paid: number;
}

export default function PaymentSummary({
  subtotal,
  discount,
  couponDiscount,
  shipping,
  total,
  paid
}: PaymentSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="space-y-4">
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Tổng tiền hàng</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Giảm giá trực tiếp</span>
            <span className="font-medium text-red-600">-{formatCurrency(discount)}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-base">
            <span className="text-gray-600">Mã giảm giá</span>
            <span className="font-medium text-red-600">-{formatCurrency(couponDiscount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-base">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium">{formatCurrency(shipping)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
          <span>Tổng thanh toán</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {paid > 0 && (
          <div className="flex justify-between text-base text-green-600">
            <span>Đã thanh toán</span>
            <span>{formatCurrency(paid)}</span>
          </div>
        )}
      </div>
    </div>
  );
} 