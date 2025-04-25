import { CartState } from '@/types/cart';

interface CartSummaryProps {
  cart: CartState;
  onCheckout: () => void;
}

export default function CartSummary({ cart, onCheckout }: CartSummaryProps) {
  const { items, total, loading } = cart;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tổng quan giỏ hàng</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Tổng sản phẩm:</span>
          <span>{items.length}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Tổng tiền:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={loading || items.length === 0}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </button>
    </div>
  );
} 