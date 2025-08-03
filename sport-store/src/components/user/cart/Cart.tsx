import { CartState } from '@/types/cart';
import CartList from './CartList';
import CartSummary from './CartSummary';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CartProps {
  cart: CartState;
  selectedItems: string[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onToggleSelect: (itemId: string) => void;
  onSelectAll: () => void;
  onCheckout: () => void;
}

export default function Cart({ 
  cart, 
  selectedItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onToggleSelect, 
  onSelectAll, 
  onCheckout 
}: CartProps) {
  const router = useRouter();

  const handleRemoveSelected = () => {
    selectedItems.forEach(id => onRemoveItem(id));
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleContinueShopping = () => {
    router.push('/user');
  };

  // Breadcrumb component
  const CartBreadcrumb = () => (
    <nav className="flex mb-6 text-sm text-gray-600">
      <Link href="/" className="hover:text-red-600 transition-colors duration-200">
        Trang chủ
      </Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-800 font-medium">Giỏ hàng</span>
    </nav>
  );

  if (cart.loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartBreadcrumb />
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cart.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartBreadcrumb />
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
      <div className="min-h-fit bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <CartBreadcrumb />
          
          {/* Empty Cart Content */}
          <div className="flex flex-col items-center justify-center min-h-[30vh] px-4 pb-4">
            {/* Animated Icon */}
            <div className="relative mb-4">
              {/* Background circles for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-8 shadow-2xl border border-gray-100">
                <div className="relative">
                  {/* Main shopping bag icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <ShoppingBag size={48} className="text-white drop-shadow-sm" />
                  </div>
                  
                  {/* Floating elements for visual interest */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                Khám phá bộ sưu tập mới nhất của chúng tôi và tìm kiếm những sản phẩm phù hợp với phong cách của bạn
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button 
                onClick={handleGoBack}
                className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group font-medium"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Quay lại
              </button>
              <button 
                onClick={handleContinueShopping} 
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center group font-medium"
              >
                Tiếp tục mua sắm
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <CartBreadcrumb />
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
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
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium">Sản phẩm ({cart.items.length})</h2>
              <button
                onClick={onSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedItems.length === cart.items.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
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
            onToggleSelect={onToggleSelect}
          />
        </div>
        <div>
          <CartSummary 
            items={cart.items}
            selectedItems={selectedItems}
            onCheckout={onCheckout}
          />
        </div>
      </div>
    </div>
  );
} 