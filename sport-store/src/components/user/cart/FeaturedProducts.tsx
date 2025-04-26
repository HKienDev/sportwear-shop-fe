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
      className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showAnimation ? 1 : 0, y: showAnimation ? 0 : 20 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">Sản phẩm đề xuất</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 w-full bg-gray-100 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-red-600 font-medium">{product.price.toLocaleString()} VND</p>
                <button 
                  onClick={() => onAddToCart(product.id)}
                  className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm"
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