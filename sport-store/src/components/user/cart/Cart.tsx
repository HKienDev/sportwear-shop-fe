import { CartState } from '@/types/cart';
import CartList from './CartList';
import CartSummary from './CartSummary';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartProps {
  cart: CartState;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export default function Cart({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleToggleSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(id => onRemoveItem(id));
    setSelectedItems([]);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleContinueShopping = () => {
    router.push('/user');
  };

  if (cart.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cart.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-red-500 mb-4">{cart.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <p className="text-lg text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <div className="flex space-x-4">
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Quay lại
            </button>
            <button 
              onClick={handleContinueShopping} 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
            >
              Tiếp tục mua sắm
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-500 hover:text-gray-700 mr-6"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
        </div>
        <button
          onClick={handleContinueShopping}
          className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-all duration-300"
        >
          <ShoppingBag size={16} className="mr-1" />
          <span>Tiếp tục mua sắm</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Sản phẩm ({cart.items.length})</h2>
            {selectedItems.length > 0 && (
              <button
                onClick={handleRemoveSelected}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Xóa đã chọn ({selectedItems.length})
              </button>
            )}
          </div>
          <CartList
            items={cart.items}
            selectedItems={selectedItems}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onToggleSelect={handleToggleSelect}
          />
        </div>
        <div>
          <CartSummary 
            items={cart.items}
            totalQuantity={cart.totalQuantity}
            cartTotal={cart.cartTotal}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </div>
  );
} 