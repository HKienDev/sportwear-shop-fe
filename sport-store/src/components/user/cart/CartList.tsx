import { CartItem } from '@/types/cart';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartListProps {
  items: CartItem[];
  selectedItems: string[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onToggleSelect: (itemId: string) => void;
  showAnimation?: boolean;
}

export default function CartList({ 
  items, 
  selectedItems,
  onUpdateQuantity, 
  onRemoveItem,
  onToggleSelect,
  showAnimation = true 
}: CartListProps) {
  if (items.length === 0) {
    return (
      <motion.div 
        initial={showAnimation ? { opacity: 0, y: 20 } : false}
        animate={showAnimation ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm"
      >
        <div className="w-24 h-24 mb-4 relative">
          <Image
            src="/images/empty-cart.png"
            alt="Empty cart"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-lg text-gray-500 mb-2">Giỏ hàng của bạn đang trống</p>
        <p className="text-sm text-gray-400">Hãy thêm sản phẩm vào giỏ hàng</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={showAnimation ? { opacity: 0 } : false}
      animate={showAnimation ? { opacity: 1 } : false}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {items.map((item, index) => (
        <motion.div
          key={item._id || `${item.product.sku}-${item.color}-${item.size}-${index}`}
          initial={showAnimation ? { opacity: 0, x: -20 } : false}
          animate={showAnimation ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => onToggleSelect(item._id)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Product Image */}
              <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                <Image
                  src={item.product.mainImage}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.color && <span className="mr-2">Màu: {item.color}</span>}
                      {item.size && <span>Cỡ: {item.size}</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-blue-600">
                        {item.totalPrice.toLocaleString('vi-VN')}đ
                      </p>
                      {item.product.originalPrice > item.product.salePrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {item.product.originalPrice.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 