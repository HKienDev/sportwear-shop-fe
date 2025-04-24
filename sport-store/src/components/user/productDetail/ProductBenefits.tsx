import { Truck, Shield } from 'lucide-react';

interface ProductBenefitsProps {
  benefits?: {
    title: string;
    description: string;
  }[];
}

const ProductBenefits: React.FC<ProductBenefitsProps> = ({ 
  benefits = [
    {
      title: "Giao hàng miễn phí",
      description: "Với đơn hàng trên 500.000 VND"
    },
    {
      title: "Bảo hành 24 tháng",
      description: "Đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất"
    },
    {
      title: "Nguyên hộp, đầy đủ phụ kiện",
      description: "Sản phẩm chính hãng từ nhà sản xuất"
    }
  ]
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="font-medium text-gray-900">Chính Sách Của Hàng</h3>
      
      <div className="flex items-start gap-3">
        <div className="text-gray-500 mt-1">
          <Truck size={20} />
        </div>
        <div>
          <p className="text-gray-900 font-medium">{benefits[0].title}</p>
          <p className="text-sm text-gray-500">{benefits[0].description}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="text-gray-500 mt-1">
          <Shield size={20} />
        </div>
        <div>
          <p className="text-gray-900 font-medium">{benefits[1].title}</p>
          <p className="text-sm text-gray-500">{benefits[1].description}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <div className="text-gray-500 mt-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-gray-900 font-medium">{benefits[2].title}</p>
          <p className="text-sm text-gray-500">{benefits[2].description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductBenefits; 