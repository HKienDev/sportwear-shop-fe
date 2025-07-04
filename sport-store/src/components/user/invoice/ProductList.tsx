import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  image: string;
  categoryName: string;
  color: string;
  size: string;
}

interface ProductListProps {
  products: Product[];
  animateItems: boolean;
}

export default function ProductList({ products, animateItems }: ProductListProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">Các sản phẩm đã mua</h3>
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`product-item flex flex-col sm:flex-row border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden ${animateItems ? 'animated-fade-in' : ''}`}
            style={{
              opacity: animateItems ? 1 : 0, 
              transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease-out ${0.1 + index * 0.1}s`
            }}
          >
            <div className="product-image w-full sm:w-20 lg:w-24 h-20 sm:h-20 lg:h-24 bg-gray-100 flex items-center justify-center overflow-hidden relative">
              {product.image ? (
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80px, 96px"
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-400 font-medium text-xs sm:text-sm">{product.brand}</span>
              )}
            </div>
            <div className="product-details p-3 sm:p-4 flex-1 flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1">
                <h4 className="product-name font-medium text-gray-900 line-clamp-2 sm:line-clamp-1">{product.name}</h4>
                <div className="product-meta mt-1 text-gray-500">
                  {product.color || 'Mặc định'} • Kích cỡ: {product.size}
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end space-x-2 sm:space-x-0">
                <div className="product-price font-medium text-gray-900">
                  {product.price.toLocaleString('vi-VN')} VND
                </div>
                <div className="product-quantity text-gray-500">
                  Số lượng: {product.quantity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 