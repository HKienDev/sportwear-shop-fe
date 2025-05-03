import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Package, DollarSign, Box, Info, AlertCircle } from "lucide-react";
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
  categories = []
}: DetailInfoFormProps) {
  useEffect(() => {
    console.log('DetailInfoForm - formData:', formData);
    console.log('DetailInfoForm - categories:', categories);
    console.log('DetailInfoForm - current categoryId:', formData.categoryId);
    if (Array.isArray(categories)) {
      const foundCategory = categories.find(cat => cat.categoryId === formData.categoryId);
      console.log('DetailInfoForm - current category:', foundCategory);
    }
  }, [categories, formData]);
  
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    onFieldChange('tags', tags);
  };

  const currentCategory = Array.isArray(categories) ? categories.find(cat => cat.categoryId === formData.categoryId) : null;
  
  console.log('Current category in DetailInfoForm:', currentCategory);
  console.log('Categories in DetailInfoForm:', categories);
  console.log('CategoryId in DetailInfoForm:', formData.categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Info className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" />
            Thể loại
          </Label>
          {!formData.categoryId && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Bắt buộc
            </span>
          )}
        </div>
        <Select 
          value={formData.categoryId || ""}
          onValueChange={(value) => onFieldChange('categoryId', value)}
        >
          <SelectTrigger className="w-full transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500">
            <SelectValue>
              {categories.find(cat => cat.categoryId === formData.categoryId)?.name || "Chọn danh mục"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category.categoryId} value={category.categoryId}>
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

      {/* Brand Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            Thương hiệu
          </Label>
          {!formData.brand && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Bắt buộc
            </span>
          )}
        </div>
        <Input 
          value={formData.brand}
          onChange={(e) => onFieldChange('brand', e.target.value)}
          placeholder="Nhập thương hiệu sản phẩm"
          className="transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      {/* Price Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              Giá gốc
            </Label>
            {!formData.originalPrice && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Bắt buộc
              </span>
            )}
          </div>
          <Input 
            type="number"
            value={formData.originalPrice}
            onChange={(e) => onFieldChange('originalPrice', parseFloat(e.target.value) || 0)}
            placeholder="Nhập giá gốc sản phẩm"
            className="transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        {/* Sale Price */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-500" />
            Giá khuyến mãi
          </Label>
          <Input 
            type="number"
            value={formData.salePrice}
            onChange={(e) => onFieldChange('salePrice', parseFloat(e.target.value) || 0)}
            placeholder="Nhập giá khuyến mãi sản phẩm"
            className="transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Stock Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Box className="w-4 h-4 text-orange-500" />
            Số lượng tồn kho
          </Label>
          {!formData.stock && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Bắt buộc
            </span>
          )}
        </div>
        <Input 
          type="number"
          value={formData.stock}
          onChange={(e) => onFieldChange('stock', parseInt(e.target.value) || 0)}
          placeholder="Nhập số lượng tồn kho"
          className="transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4 text-orange-500" />
          Tags
        </Label>
        <Input 
          value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="Nhập tags, phân cách bằng dấu phẩy"
          className="transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500">Ví dụ: thể thao, chạy bộ, gym</p>
      </div>
    </div>
  );
} 