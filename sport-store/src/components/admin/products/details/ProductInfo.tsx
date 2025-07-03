import { useState } from 'react';
import { AdminProduct } from '@/types/product';
import { Clock, Tag, Info, Award, Box, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductInfoProps {
  product: AdminProduct;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  
  const formattedDate = new Date(product.createdAt || '').toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Xác định xem mô tả có dài hay không
  const isLongDescription = (product.description?.length || 0) > 200;
  const shortenedDesc = isLongDescription && !showFullDesc
    ? `${product.description?.substring(0, 200)}...`
    : product.description;
    
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header với gradient */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Info size={20} className="text-indigo-500" />
          Thông tin sản phẩm
        </h2>
      </div>
      
      <div className="p-6">
        {/* Thông tin chính của sản phẩm */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-800 mb-2">{product.name}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-indigo-600">{product.brand}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-gray-500">SKU: {product.sku || 'Chưa có'}</span>
          </div>
        </div>
        
        {/* Giá và trạng thái */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-end gap-2">
            {product.salePrice < product.originalPrice ? (
              <>
                <span className="text-2xl font-bold text-indigo-600">{formatCurrency(product.salePrice)}</span>
                <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="ml-1 text-xs px-2 py-1 bg-red-50 text-red-500 rounded-full font-medium">
                  {Math.round(100 - (product.salePrice / product.originalPrice) * 100)}% giảm
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-800">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm">
              <Box size={16} className="mr-1 text-gray-500" />
              <span className="font-medium">{product.stock}</span>
              <span className="text-gray-500 ml-1">trong kho</span>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              product.isActive 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {product.isActive ? 'Đang bán' : 'Ngừng bán'}
            </span>
          </div>
        </div>
        
        {/* Các thông số chi tiết */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <Tag size={18} className="text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm mb-1">Danh mục</p>
                <p className="font-medium">{product.categoryId || 'Chưa phân loại'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Award size={18} className="text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm mb-1">Thương hiệu</p>
                <p className="font-medium">{product.brand}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock size={18} className="text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm mb-1">Ngày tạo</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mô tả sản phẩm */}
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-800 mb-3 flex items-center">
            <Info size={16} className="text-indigo-500 mr-2" />
            Mô tả sản phẩm
          </h4>
          
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{shortenedDesc}</p>
            
            {isLongDescription && (
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 mt-2 font-medium"
              >
                {showFullDesc ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Thu gọn
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Xem thêm
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <h4 className="text-base font-medium text-gray-800 mb-3 flex items-center">
            <Tag size={16} className="text-indigo-500 mr-2" />
            Tags
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {product.tags && product.tags.length > 0 ? (
              product.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-sm hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">Không có tags</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}