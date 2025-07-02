import { motion } from 'framer-motion';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  showAnimation?: boolean;
  onCheckout: () => void;
}

export default function OrderSummary({
  subtotal,
  discount,
  shipping,
  total,
  showAnimation = true,
  onCheckout
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Order Summary */}
      <motion.div 
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6"
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
              <span className="font-medium">{subtotal.toLocaleString()} VND</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Giảm giá trực tiếp</span>
              <span className="font-medium text-green-600">-{discount.toLocaleString()} VND</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-700">Phí vận chuyển</span>
              <span className="font-medium">{shipping.toLocaleString()} VND</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Tổng tiền thanh toán</span>
              <span className="text-xl font-bold text-red-600">{total.toLocaleString()} VND</span>
            </div>
            
            <div className="text-green-600 text-right text-sm mt-1">
              Tiết kiệm {discount.toLocaleString()} VND
            </div>
            
            <div className="text-gray-500 text-right text-xs">
              (Đã bao gồm thuế VAT nếu có)
            </div>
          </div>
          
          <button 
            onClick={onCheckout}
            className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center justify-center"
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
    </div>
  );
} 