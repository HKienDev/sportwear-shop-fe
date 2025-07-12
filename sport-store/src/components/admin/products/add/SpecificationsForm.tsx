import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Package, Weight, Move, Droplets, Shield, MapPin, Zap, WashingMachine } from "lucide-react";
import { ProductFormData } from "@/types/product";

interface SpecificationsFormProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: ProductFormData[keyof ProductFormData]) => void;
}

export default function SpecificationsForm({ 
  formData, 
  onFieldChange 
}: SpecificationsFormProps) {
  
  const handleSpecificationChange = (field: string, value: string) => {
    const currentSpecs = formData.specifications || {};
    const updatedSpecs = {
      ...currentSpecs,
      [field]: value
    };
    onFieldChange('specifications', updatedSpecs);
  };

  const specifications = formData.specifications || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Settings className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Thông số kỹ thuật</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Tùy chọn
        </span>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Thông số kỹ thuật giúp khách hàng hiểu rõ hơn về sản phẩm. 
          Nếu không nhập, hệ thống sẽ hiển thị &quot;Đang cập nhật&quot;.
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Material */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" />
            Chất liệu
          </Label>
          <Input 
            value={specifications.material || ''}
            onChange={(e) => handleSpecificationChange('material', e.target.value)}
            placeholder="Ví dụ: Polyester, Cotton"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Weight className="w-4 h-4 text-blue-500" />
            Trọng lượng
          </Label>
          <Input 
            value={specifications.weight || ''}
            onChange={(e) => handleSpecificationChange('weight', e.target.value)}
            placeholder="Ví dụ: 200g"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Stretch */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Move className="w-4 h-4 text-blue-500" />
            Độ co giãn
          </Label>
          <Input 
            value={specifications.stretch || ''}
            onChange={(e) => handleSpecificationChange('stretch', e.target.value)}
            placeholder="Ví dụ: Cao, Trung bình, Thấp"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Absorbency */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            Khả năng thấm hút
          </Label>
          <Input 
            value={specifications.absorbency || ''}
            onChange={(e) => handleSpecificationChange('absorbency', e.target.value)}
            placeholder="Ví dụ: Tốt, Trung bình, Kém"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Warranty */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Bảo hành
          </Label>
          <Input 
            value={specifications.warranty || ''}
            onChange={(e) => handleSpecificationChange('warranty', e.target.value)}
            placeholder="Ví dụ: 12 tháng"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Origin */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            Xuất xứ
          </Label>
          <Input 
            value={specifications.origin || ''}
            onChange={(e) => handleSpecificationChange('origin', e.target.value)}
            placeholder="Ví dụ: Việt Nam"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Fabric Technology */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            Công nghệ vải
          </Label>
          <Input 
            value={specifications.fabricTechnology || ''}
            onChange={(e) => handleSpecificationChange('fabricTechnology', e.target.value)}
            placeholder="Ví dụ: Thoáng khí, Quick-Dry"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Care Instructions */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <WashingMachine className="w-4 h-4 text-blue-500" />
            Hướng dẫn giặt
          </Label>
          <Input 
            value={specifications.careInstructions || ''}
            onChange={(e) => handleSpecificationChange('careInstructions', e.target.value)}
            placeholder="Ví dụ: Giặt tay, không sấy"
            className="transition-all duration-200 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Gợi ý:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Chất liệu: Mô tả thành phần vải (Polyester, Cotton, Spandex...)</li>
          <li>• Trọng lượng: Đơn vị gram hoặc kg</li>
          <li>• Độ co giãn: Cao/Trung bình/Thấp</li>
          <li>• Khả năng thấm hút: Tốt/Trung bình/Kém</li>
          <li>• Bảo hành: Thời gian bảo hành sản phẩm</li>
          <li>• Xuất xứ: Nước sản xuất</li>
          <li>• Công nghệ vải: Các tính năng đặc biệt</li>
          <li>• Hướng dẫn giặt: Cách bảo quản sản phẩm</li>
        </ul>
      </div>
    </div>
  );
} 