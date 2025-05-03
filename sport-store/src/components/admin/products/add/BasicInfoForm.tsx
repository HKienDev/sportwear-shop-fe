import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "@/types/product";
import { useEffect } from "react";
import { Info, AlertCircle } from "lucide-react";

interface BasicInfoFormProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string) => void;
}

export default function BasicInfoForm({ formData, onFieldChange }: BasicInfoFormProps) {
  useEffect(() => {
    console.log('BasicInfoForm mounted/updated with formData:', formData);
  }, [formData]);

  if (!formData) {
    console.warn('BasicInfoForm: formData is undefined');
    return null;
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Name changed:', e.target.value);
    onFieldChange('name', e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Description changed:', e.target.value);
    onFieldChange('description', e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Info className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Tên sản phẩm</Label>
            <span className="text-xs text-gray-500">
              {formData.name ? formData.name.length : 0}/100
            </span>
          </div>
          <div className="relative">
            <Input 
              value={formData.name || ''}
              onChange={handleNameChange}
              placeholder="Nhập tên sản phẩm" 
              className="block w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
              maxLength={100}
            />
            {!formData.name && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Tên sản phẩm nên ngắn gọn, rõ ràng và dễ hiểu
          </p>
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Mô tả sản phẩm</Label>
            <span className="text-xs text-gray-500">
              {formData.description ? formData.description.length : 0}/1000
            </span>
          </div>
          <div className="relative">
            <Textarea 
              value={formData.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Nhập mô tả chi tiết về sản phẩm..." 
              className="block w-full h-40 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 resize-none"
              maxLength={1000}
            />
            {!formData.description && (
              <div className="absolute top-3 right-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Mô tả chi tiết về sản phẩm, bao gồm đặc điểm, công dụng và lợi ích
          </p>
        </div>
      </div>
    </div>
  );
} 