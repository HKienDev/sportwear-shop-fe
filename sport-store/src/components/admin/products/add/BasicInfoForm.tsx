import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData, ProductFormErrors } from "@/types/product";
import { useEffect } from "react";
import { Info, AlertCircle } from "lucide-react";

interface BasicInfoFormProps {
  formData: ProductFormData;
  errors?: ProductFormErrors;
  onFieldChange: (field: keyof ProductFormData, value: string) => void;
}

export default function BasicInfoForm({ formData, errors = {}, onFieldChange }: BasicInfoFormProps) {
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
    <div className="space-y-8 border-2 border-gray-300 rounded-xl p-6 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-200">
        <Info className="w-7 h-7 text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h3>
      </div>

      {/* Form Content */}
      <div className="space-y-8">
        {/* Product Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-gray-700">Tên sản phẩm</Label>
            <span className="text-xs text-gray-500">
              {formData.name ? formData.name.length : 0}/100
            </span>
          </div>
          <div className="relative">
            <Input 
              value={formData.name || ''}
              onChange={handleNameChange}
              placeholder="Nhập tên sản phẩm" 
              className={`block w-full rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 text-base px-4 py-3 ${errors.name ? 'border-red-500' : ''}`}
              maxLength={100}
            />
            {!formData.name && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Tên sản phẩm nên ngắn gọn, rõ ràng và dễ hiểu
          </p>
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-gray-700">Mô tả sản phẩm</Label>
            <span className="text-xs text-gray-500">
              {formData.description ? formData.description.length : 0}/1000
            </span>
          </div>
          <div className="relative">
            <Textarea 
              value={formData.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Nhập mô tả chi tiết về sản phẩm..." 
              className={`block w-full h-40 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 resize-none text-base px-4 py-3 ${errors.description ? 'border-red-500' : ''}`}
              maxLength={1000}
            />
            {!formData.description && (
              <div className="absolute top-3 right-3">
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          {errors.description && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Mô tả chi tiết về sản phẩm, bao gồm đặc điểm, công dụng và lợi ích
          </p>
        </div>
      </div>
    </div>
  );
} 