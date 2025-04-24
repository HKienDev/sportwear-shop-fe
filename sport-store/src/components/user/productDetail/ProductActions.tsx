import { ShoppingBag, Heart } from 'lucide-react';

interface ProductActionsProps {
  isSizeSelected: boolean;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
  isOutOfStock?: boolean;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  isSizeSelected, 
  onBuyNow, 
  onAddToCart,
  isOutOfStock = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <button 
        className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        disabled={!isSizeSelected || isOutOfStock}
        onClick={onBuyNow}
      >
        <ShoppingBag size={20} />
        {isOutOfStock ? 'Hết hàng' : 'Mua Ngay'}
      </button>
      <button 
        className="flex-1 py-3 px-6 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        disabled={!isSizeSelected || isOutOfStock}
        onClick={onAddToCart}
      >
        <Heart size={20} />
        {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
};

export default ProductActions; 