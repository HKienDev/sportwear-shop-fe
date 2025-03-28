import { Product } from '@/types/product';

interface ProductVariantsProps {
  product: Product;
}

export default function ProductVariants({ product }: ProductVariantsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Biến thể sản phẩm</h2>
      
      {/* Màu sắc */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {product.color?.map((color, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kích thước */}
      <div>
        <h3 className="text-lg font-medium mb-2">Kích thước</h3>
        <div className="flex flex-wrap gap-2">
          {product.size?.map((size, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {size}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 