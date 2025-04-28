interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  brand: string;
}

interface ProductListProps {
  products: Product[];
  animateItems: boolean;
}

export default function ProductList({ products, animateItems }: ProductListProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-4">Các sản phẩm đã mua</h3>
      <div className="space-y-4 mb-8">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-hidden ${animateItems ? 'animated-fade-in' : ''}`}
            style={{
              opacity: animateItems ? 1 : 0, 
              transform: animateItems ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.5s ease-out ${0.1 + index * 0.1}s`
            }}
          >
            <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-blue-400 to-green-300 flex items-center justify-center">
              <span className="text-white font-medium">{product.brand}</span>
            </div>
            <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <div className="mt-1 text-sm text-gray-500">{product.description}</div>
              </div>
              <div className="mt-3 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end">
                <div className="font-medium text-gray-900">{product.price.toLocaleString('vi-VN')} VND</div>
                <div className="text-sm text-gray-500">Số lượng: {product.quantity}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 