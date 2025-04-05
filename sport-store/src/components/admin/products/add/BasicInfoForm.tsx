import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "@/types/product";
import { useEffect } from "react";

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
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium text-gray-700">TÊN SẢN PHẨM</Label>
        <Input 
          value={formData.name || ''}
          onChange={handleNameChange}
          placeholder="Nhập tên sản phẩm" 
          className="mt-1.5 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">MÔ TẢ SẢN PHẨM</Label>
        <Textarea 
          value={formData.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Nhập mô tả chi tiết về sản phẩm..." 
          className="mt-1.5 block w-full h-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
} 