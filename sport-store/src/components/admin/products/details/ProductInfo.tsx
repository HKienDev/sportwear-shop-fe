import { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Thông tin sản phẩm</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Tên sản phẩm:</p>
          <p className="font-medium">{product.name}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Thương hiệu:</p>
          <p className="font-medium">{product.brand}</p>
        </div>
        
        <div>
          <p className="text-gray-600">SKU:</p>
          <p className="font-medium">{product.sku || 'Chưa có'}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Danh mục:</p>
          <p className="font-medium">
            {typeof product.category === 'object' && product.category !== null
              ? product.category.name
              : product.category || 'Chưa phân loại'}
          </p>
        </div>
        
        <div>
          <p className="text-gray-600">Giá:</p>
          <p className="font-medium">
            {product.discountPrice ? (
              <span className="text-red-600">{product.discountPrice.toLocaleString()}đ</span>
            ) : (
              <span>{product.price.toLocaleString()}đ</span>
            )}
          </p>
        </div>
        
        <div>
          <p className="text-gray-600">Tồn kho:</p>
          <p className="font-medium">{product.stock}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Trạng thái:</p>
          <p className="font-medium">
            <span className={`px-2 py-1 rounded-full text-sm ${
              product.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.isActive ? 'Đang bán' : 'Ngừng bán'}
            </span>
          </p>
        </div>
        
        <div>
          <p className="text-gray-600">Ngày tạo:</p>
          <p className="font-medium">
            {new Date(product.createdAt || '').toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-600">Mô tả:</p>
        <p className="mt-2 text-gray-800 whitespace-pre-wrap">{product.description}</p>
      </div>

      <div className="mt-4">
        <p className="text-gray-600">Tags:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {product.tags && product.tags.length > 0 ? (
            product.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Không có tags</p>
          )}
        </div>
      </div>
    </div>
  );
} 