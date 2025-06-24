import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Ruler, Palette, AlertCircle } from "lucide-react";
import { ProductFormData } from "@/types/product";
import { useState } from "react";
import { toast } from "sonner";

interface SizeColorFormProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string[] | boolean) => void;
}

export default function SizeColorForm({
  formData,
  onFieldChange,
}: SizeColorFormProps) {
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  // Đảm bảo sizes và colors là mảng
  const sizes = Array.isArray(formData.sizes) ? formData.sizes : [];
  const colors = Array.isArray(formData.colors) ? formData.colors : [];

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    
    if (sizes.includes(newSize.trim())) {
      toast.error('Kích thước này đã tồn tại');
      return;
    }

    onFieldChange('sizes', [...sizes, newSize.trim()]);
    setNewSize("");
  };

  const handleAddColor = () => {
    if (!newColor.trim()) return;
    
    if (colors.includes(newColor.trim())) {
      toast.error('Màu sắc này đã tồn tại');
      return;
    }

    onFieldChange('colors', [...colors, newColor.trim()]);
    setNewColor("");
  };

  const handleRemoveSize = (size: string) => {
    onFieldChange('sizes', sizes.filter(s => s !== size));
  };

  const handleRemoveColor = (color: string) => {
    onFieldChange('colors', colors.filter(c => c !== color));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Ruler className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Kích thước & Màu sắc</h3>
      </div>

      {/* Sizes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-orange-500" />
            Kích thước
          </Label>
          {sizes.length === 0 && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Bắt buộc
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Nhập kích thước mới"
            className="flex-1 transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
          />
          <Button 
            onClick={handleAddSize} 
            size="sm" 
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
            disabled={!newSize.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <div key={size} className="bg-orange-50 rounded-full px-3 py-1.5 flex items-center gap-1.5 group hover:bg-orange-100 transition-all duration-200">
                <span className="text-sm font-medium text-orange-700">{size}</span>
                <button 
                  onClick={() => handleRemoveSize(size)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-3.5 h-3.5 text-orange-500 hover:text-orange-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Palette className="w-4 h-4 text-orange-500" />
            Màu sắc
          </Label>
          {colors.length === 0 && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Bắt buộc
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Nhập màu sắc mới"
            className="flex-1 transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500"
          />
          <Button 
            onClick={handleAddColor} 
            size="sm" 
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
            disabled={!newColor.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <div key={color} className="bg-orange-50 rounded-full px-3 py-1.5 flex items-center gap-1.5 group hover:bg-orange-100 transition-all duration-200">
                <span className="text-sm font-medium text-orange-700">{color}</span>
                <button 
                  onClick={() => handleRemoveColor(color)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-3.5 h-3.5 text-orange-500 hover:text-orange-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 