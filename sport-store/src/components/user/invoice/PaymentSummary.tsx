interface PaymentSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paid: number;
}

export default function PaymentSummary({ subtotal, discount, shipping, total, paid }: PaymentSummaryProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h3 className="font-medium text-gray-700 mb-4">Tổng thanh toán</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền sản phẩm:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Giảm giá:</span>
          <span className="font-medium">{formatCurrency(discount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium">{formatCurrency(shipping)}</span>
        </div>
        <div className="my-3 border-b border-gray-200"></div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-900">Phải thanh toán:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đã thanh toán:</span>
          <span className="font-medium text-green-600">{formatCurrency(paid)}</span>
        </div>
      </div>
    </div>
  );
} 