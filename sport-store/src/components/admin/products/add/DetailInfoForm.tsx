import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Package, DollarSign, Box } from "lucide-react";
import { Category, ProductFormData } from "@/types/product";
import { useEffect } from "react";

interface DetailInfoFormProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | number | string[] | boolean) => void;
  categories: Category[];
}

export default function DetailInfoForm({ 
  formData, 
  onFieldChange,
  categories
}: DetailInfoFormProps) {
  useEffect(() => {
    console.log('DetailInfoForm - categories:', categories);
  }, [categories]);
  
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    onFieldChange('tags', tags);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          THỂ LOẠI
        </Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(value) => onFieldChange('categoryId', value)}
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category._id} value={category.categoryId}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories" disabled>
                Không có danh mục
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package className="w-4 h-4" />
          THƯƠNG HIỆU
        </Label>
        <Input 
          value={formData.brand}
          onChange={(e) => onFieldChange('brand', e.target.value)}
          placeholder="Nhập thương hiệu sản phẩm"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          GIÁ GỐC
        </Label>
        <Input 
          type="number"
          value={formData.originalPrice}
          onChange={(e) => onFieldChange('originalPrice', parseFloat(e.target.value) || 0)}
          placeholder="Nhập giá gốc sản phẩm"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          GIÁ KHUYẾN MÃI
        </Label>
        <Input 
          type="number"
          value={formData.salePrice}
          onChange={(e) => onFieldChange('salePrice', parseFloat(e.target.value) || 0)}
          placeholder="Nhập giá khuyến mãi sản phẩm"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Box className="w-4 h-4" />
          SỐ LƯỢNG TỒN KHO
        </Label>
        <Input 
          type="number"
          value={formData.stock}
          onChange={(e) => onFieldChange('stock', parseInt(e.target.value) || 0)}
          placeholder="Nhập số lượng tồn kho"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          TAGS
        </Label>
        <Input 
          value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="Nhập tags, phân cách bằng dấu phẩy"
          className="mt-1.5"
        />
      </div>
    </div>
  );
} 