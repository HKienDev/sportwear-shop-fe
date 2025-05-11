import { useState } from 'react';
import { Product } from '@/types/product';

interface ProductVariantsProps {
  product: Product;
}

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

export default function ProductVariants({ product }: ProductVariantsProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] || null);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">Tùy chọn sản phẩm</span>
        <div className="h-1 flex-grow bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-70"></div>
      </h2>
      
      {/* Màu sắc */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <span className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 003 3h10a3 3 0 003-3V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5-1.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </span>
          Màu sắc
        </h3>
        
        {product.colors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color, index) => (
              <button 
                key={index}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-2 ${
                  selectedColor === color
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedColor(color)}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
                {colorNames[color] || color}
                {selectedColor === color && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 bg-gray-50 rounded-lg p-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Không có màu sắc được cung cấp
          </div>
        )}
      </div>
      
      {/* Kích thước */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
          <span className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 013.5 3.5V8H5.5A3.5 3.5 0 012 4.5v-1A1.5 1.5 0 013.5 2h2zm2.5 5.5V8a5 5 0 01-5-5h1.5a3.5 3.5 0 013.5 3.5v1zm7.5-1a1.5 1.5 0 00-1.5-1.5h-2A3.5 3.5 0 0115.5 8H19V5.5a3.5 3.5 0 00-3.5-3.5h-1zM10 19a7 7 0 100-14 7 7 0 000 14z" clipRule="evenodd" />
            </svg>
          </span>
          Kích thước
        </h3>
        
        {product.sizes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  selectedSize === size
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
                {selectedSize === size && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 bg-gray-50 rounded-lg p-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Không có kích thước được cung cấp
          </div>
        )}
      </div>
      
      {/* Hiển thị lựa chọn */}
      {(selectedColor || selectedSize) && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Lựa chọn của bạn</h4>
            <div className="flex flex-wrap gap-4">
              {selectedColor && (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border border-gray-200 mr-2"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-sm text-gray-700">
                    {colorNames[selectedColor] || selectedColor}
                  </span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span className="text-sm text-gray-700">{selectedSize}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}