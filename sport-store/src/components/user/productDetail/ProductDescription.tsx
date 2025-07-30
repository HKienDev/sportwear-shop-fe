'use client';

import { useState } from 'react';
import ProductReviews from './ProductReviews';

interface ProductDescriptionProps {
  description: string;
  specifications?: {
    material?: string;
    weight?: string;
    stretch?: string;
    absorbency?: string;
    warranty?: string;
    origin?: string;
    fabricTechnology?: string;
    careInstructions?: string;
  };
  productSku?: string;
  productName?: string;
  currentRating?: number;
  numReviews?: number;
}

type TabType = 'description' | 'specifications' | 'reviews';

const ProductDescription: React.FC<ProductDescriptionProps> = ({ 
  description, 
  specifications, 
  productSku, 
  productName, 
  currentRating = 0, 
  numReviews = 0 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {description}
            </p>
          </div>
        );
      case 'specifications':
        return (
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Chất liệu</span>
                  <span className="text-gray-600">{specifications?.material || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Trọng lượng</span>
                  <span className="text-gray-600">{specifications?.weight || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Độ co giãn</span>
                  <span className="text-gray-600">{specifications?.stretch || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Khả năng thấm hút</span>
                  <span className="text-gray-600">{specifications?.absorbency || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Bảo hành</span>
                  <span className="text-gray-600">{specifications?.warranty || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Xuất xứ</span>
                  <span className="text-gray-600">{specifications?.origin || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Công nghệ vải</span>
                  <span className="text-gray-600">{specifications?.fabricTechnology || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-700">Hướng dẫn giặt</span>
                  <span className="text-gray-600">{specifications?.careInstructions || "Đang cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="prose max-w-none">
            {productSku && productName ? (
              <ProductReviews
                productSku={productSku}
                productName={productName}
                currentRating={currentRating}
                numReviews={numReviews}
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá sản phẩm</h3>
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">Chưa có đánh giá nào</p>
                  <p className="text-sm text-gray-500">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          <button 
            onClick={() => handleTabClick('description')}
            className={`pb-4 border-b-2 font-medium transition-colors ${
              activeTab === 'description' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mô tả sản phẩm
          </button>
          <button 
            onClick={() => handleTabClick('specifications')}
            className={`pb-4 border-b-2 font-medium transition-colors ${
              activeTab === 'specifications' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Thông số kỹ thuật
          </button>
          <button 
            onClick={() => handleTabClick('reviews')}
            className={`pb-4 border-b-2 font-medium transition-colors ${
              activeTab === 'reviews' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Đánh giá
          </button>
        </div>
      </div>
      
      {renderTabContent()}
    </div>
  );
};

export default ProductDescription; 