'use client';

import { ShoppingBag, ChevronDown, ChevronUp, Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface CartResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: CartItemType[];
    totalQuantity: number;
    cartTotal: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface OrderItemsProps {
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  formatPrice: (price: number) => string;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
}

export default function OrderItems({
  expandedSection,
  toggleSection,
  formatPrice,
  onUpdateQuantity,
  onRemoveItem
}: OrderItemsProps) {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await api.get<CartResponse>('/cart');
        
        if (response.data.success) {
          setCartItems(response.data.data.items);
        } else {
          setError('Không thể lấy dữ liệu giỏ hàng');
          toast.error('Không thể lấy dữ liệu giỏ hàng');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Đã xảy ra lỗi khi lấy dữ liệu giỏ hàng');
        toast.error('Đã xảy ra lỗi khi lấy dữ liệu giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-500">Đang tải dữ liệu giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer bg-gray-50"
        onClick={() => toggleSection('items')}
      >
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">CHI TIẾT ĐƠN HÀNG</h2>
        </div>
        {expandedSection === 'items' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
      
      {expandedSection === 'items' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="divide-y divide-gray-200"
        >
          {cartItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6"
            >
              <div className="flex items-center">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.color && <span className="mr-2">Màu: {item.color}</span>}
                        {item.size && <span>Cỡ: {item.size}</span>}
                      </p>
                      <p className="mt-1 text-sm font-medium text-blue-600">
                        Số lượng: <span className="font-bold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-red-600">{formatPrice(item.product.salePrice)}</p>
                      {item.product.originalPrice > item.product.salePrice && (
                        <p className="text-sm text-gray-500 line-through">{formatPrice(item.product.originalPrice)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {onUpdateQuantity && (
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
                    )}
                    
                    {onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
} 