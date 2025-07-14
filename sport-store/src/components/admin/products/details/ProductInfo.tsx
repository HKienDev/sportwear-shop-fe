import { useState } from 'react';
import { AdminProduct } from '@/types/product';
import { Clock, Tag, Info, Award, Box, ChevronDown, ChevronUp, DollarSign, TrendingUp, Star, Eye, ShoppingCart, Palette, Ruler, Settings } from 'lucide-react';

interface ProductInfoProps {
  product: AdminProduct;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const colorNames: Record<string, string> = {
  '#ff0000': 'Đỏ',
  '#00ff00': 'Xanh lá',
  '#0000ff': 'Xanh dương',
  '#ffff00': 'Vàng',
  '#ff00ff': 'Hồng',
  '#00ffff': 'Xanh ngọc',
  '#000000': 'Đen',
  '#ffffff': 'Trắng',
  '#808080': 'Xám',
  '#a52a2a': 'Nâu',
  '#ffa500': 'Cam',
  '#800080': 'Tím'
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
    <div className="bg-white rounded-2xl border-2 border-slate-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-500" />
          Thông tin sản phẩm
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Product Name & Brand */}
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{product.brand}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-slate-500">SKU: {product.sku || 'Chưa có'}</span>
          </div>
        </div>
        
        {/* Price & Status Section */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border-2 border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Price Display */}
            <div className="flex items-end gap-3">
              {product.salePrice < product.originalPrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{formatCurrency(product.salePrice)}</span>
                  <span className="text-sm text-slate-500 line-through">{formatCurrency(product.originalPrice)}</span>
                  <span className="ml-2 text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full font-semibold">
                    -{Math.round(100 - (product.salePrice / product.originalPrice) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-slate-800">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            
            {/* Status & Stock */}
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm bg-white px-3 py-2 rounded-lg border-2 border-slate-300">
                <Box className="w-4 h-4 mr-2 text-slate-500" />
                <span className="font-semibold text-slate-700">{product.stock}</span>
                <span className="text-slate-500 ml-1">trong kho</span>
              </div>
              
              <span className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                product.isActive 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : 'bg-red-100 text-red-700 border-2 border-red-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {product.isActive ? 'Đang bán' : 'Ngừng bán'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Product Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center">
            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{product.viewCount || 0}</div>
            <div className="text-xs text-slate-500">Lượt xem</div>
          </div>
          
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center">
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{product.soldCount || 0}</div>
            <div className="text-xs text-slate-500">Đã bán</div>
          </div>
          
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center">
            <div className="bg-yellow-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{product.rating || 0}</div>
            <div className="text-xs text-slate-500">Đánh giá</div>
          </div>
          
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 text-center">
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{product.numReviews || 0}</div>
            <div className="text-xs text-slate-500">Nhận xét</div>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-300">
          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-600" />
            Thông tin chi tiết
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <Tag className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Danh mục</p>
                <p className="font-semibold text-slate-800">{product.categoryId || 'Chưa phân loại'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <Award className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Thương hiệu</p>
                <p className="font-semibold text-slate-800">{product.brand}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <Clock className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Ngày tạo</p>
                <p className="font-semibold text-slate-800">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-500" />
            Mô tả sản phẩm
          </h4>
          
          <div className="bg-white rounded-xl border-2 border-slate-300 p-6">
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{shortenedDesc}</p>
            
            {isLongDescription && (
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 mt-4 font-semibold transition-colors duration-200"
              >
                {showFullDesc ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Thu gọn
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Xem thêm
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Tags */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" />
            Tags
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {product.tags && product.tags.length > 0 ? (
              product.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-sm font-medium hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200"
                >
                  {tag}
                </span>
              ))
            ) : (
              <div className="text-slate-500 text-sm italic bg-slate-50 rounded-lg p-4 border border-slate-200">
                Không có tags
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}