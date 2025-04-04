import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData, ProductFormErrors } from "@/types/product";

interface BasicInfoFormProps {
  data: Pick<ProductFormData, 'name' | 'description'>;
  errors: Pick<ProductFormErrors, 'name' | 'description'>;
  onChange: (field: 'name' | 'description', value: string) => void;
}

export default function BasicInfoForm({ data, errors, onChange }: BasicInfoFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div>
        <Label className="text-sm font-medium text-gray-700">TÊN SẢN PHẨM</Label>
        <Input 
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Nhập tên sản phẩm" 
          className={`mt-1 block w-full ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">MÔ TẢ SẢN PHẨM</Label>
        <Textarea 
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Nhập mô tả chi tiết về sản phẩm..." 
          className={`mt-1 block w-full h-32 ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </div>
  );
} 