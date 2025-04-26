import { CartItem } from '@/types/cart';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CartSummaryProps {
  items: CartItem[];
  totalQuantity: number;
  cartTotal: number;
  onCheckout: () => void;
  showAnimation?: boolean;
}

export default function CartSummary({ items, totalQuantity, cartTotal, onCheckout, showAnimation = true }: CartSummaryProps) {
  // Tính tổng giá gốc dựa trên originalPrice của product
  const originalTotal = items.reduce((total, item) => {
    return total + (item.product.originalPrice * item.quantity);
  }, 0);

  // Tính tổng tiền giảm giá (originalPrice - salePrice)
  const totalDiscount = items.reduce((total, item) => {
    return total + ((item.product.originalPrice - item.product.salePrice) * item.quantity);
  }, 0);

  // Debug
  console.log('Cart Items:', items);
  console.log('Original Total:', originalTotal);
  console.log('Total Discount:', totalDiscount);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: showAnimation ? 1 : 0, x: showAnimation ? 0 : 20 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">ĐƠN HÀNG (TẠM TÍNH)</h2>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Tổng tiền hàng</span>
            <span className="font-medium">{originalTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          
          {totalDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-green-600">Giảm giá trực tiếp</span>
              <span className="font-medium text-green-600">-{totalDiscount.toLocaleString('vi-VN')}đ</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-medium">Tổng tiền thanh toán</span>
            <span className="text-xl font-bold text-red-600">{cartTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          
          <div className="text-gray-500 text-right text-xs">
            (Đã bao gồm thuế VAT nếu có)
          </div>
        </div>
        
        <button 
          onClick={onCheckout}
          disabled={totalQuantity === 0}
          className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          TIẾP TỤC THANH TOÁN
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
        
        <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
          <ShieldCheckIcon className="h-4 w-4 mr-1" />
          <span>Thanh toán an toàn & bảo mật</span>
        </div>
      </div>
    </motion.div>
  );
} 