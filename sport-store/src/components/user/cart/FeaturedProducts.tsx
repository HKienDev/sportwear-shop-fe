import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface FeaturedProductsProps {
  products: Product[];
  showAnimation?: boolean;
  onAddToCart: (productId: string) => void;
}

export default function FeaturedProducts({
  products,
  showAnimation = true,
  onAddToCart
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <motion.div 
      className="mt-4 sm:mt-6 bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showAnimation ? 1 : 0, y: showAnimation ? 0 : 20 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">Sản phẩm đề xuất</h2>
      </div>
      
      <div className="p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-28 sm:h-32 md:h-36 w-full bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2.5 sm:p-3 md:p-4">
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 line-clamp-2 mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-sm sm:text-base md:text-lg text-red-600 font-medium mb-2 sm:mb-3">{product.price.toLocaleString()} VND</p>
                <button 
                  onClick={() => onAddToCart(product.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm transition-colors"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 