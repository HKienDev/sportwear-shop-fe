import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Package, DollarSign, Box } from "lucide-react";
import { Category, ProductFormData, ProductFormErrors } from "@/types/product";

interface DetailInfoFormProps {
  data: Pick<ProductFormData, 'brand' | 'originalPrice' | 'salePrice' | 'stock' | 'categoryId' | 'tags'>;
  errors: Pick<ProductFormErrors, 'brand' | 'originalPrice' | 'salePrice' | 'stock' | 'categoryId' | 'tags'>;
  categories: Category[];
  onChange: (field: keyof ProductFormData, value: any) => void;
}

export default function DetailInfoForm({ 
  data, 
  errors, 
  categories,
  onChange 
}: DetailInfoFormProps) {
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    onChange('tags', tags);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông Tin Chi Tiết</h2>
      
      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            THỂ LOẠI
          </Label>
          <Select 
            value={data.categoryId} 
            onValueChange={(value) => onChange('categoryId', value)}
          >
            <SelectTrigger className={`mt-1 w-full ${errors.categoryId ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4" />
            HÃNG
          </Label>
          <Input 
            value={data.brand}
            onChange={(e) => onChange('brand', e.target.value)}
            placeholder="Nhập tên hãng" 
            className={`mt-1 ${errors.brand ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-500">{errors.brand}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            TAG
          </Label>
          <Input 
            value={data.tags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="Nhập các tag, phân cách bằng dấu phẩy" 
            className={`mt-1 ${errors.tags ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            GIÁ GỐC
          </Label>
          <div className="mt-1 relative">
            <Input 
              type="number" 
              value={data.originalPrice}
              onChange={(e) => onChange('originalPrice', Number(e.target.value))}
              placeholder="2000000" 
              className={`pl-8 ${errors.originalPrice ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
          </div>
          {errors.originalPrice && (
            <p className="mt-1 text-sm text-red-500">{errors.originalPrice}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            GIÁ KHUYẾN MÃI
          </Label>
          <div className="mt-1 relative">
            <Input 
              type="number" 
              value={data.salePrice}
              onChange={(e) => onChange('salePrice', Number(e.target.value))}
              placeholder="1500000" 
              className={`pl-8 ${errors.salePrice ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
          </div>
          {errors.salePrice && (
            <p className="mt-1 text-sm text-red-500">{errors.salePrice}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Box className="w-4 h-4" />
            TỒN KHO
          </Label>
          <Input 
            type="number" 
            value={data.stock}
            onChange={(e) => onChange('stock', Number(e.target.value))}
            placeholder="20000" 
            className={`mt-1 ${errors.stock ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
          )}
        </div>
      </div>
    </div>
  );
} 