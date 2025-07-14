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
    <div className="space-y-8 border-2 border-gray-300 rounded-xl p-6 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-200">
        <Ruler className="w-7 h-7 text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900">Kích thước & Màu sắc</h3>
      </div>

      {/* Sizes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-orange-500" />
            Kích thước
          </Label>
          {sizes.length === 0 && (
            <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-4 h-4" />
              Bắt buộc
            </span>
          )}
        </div>
        <div className="flex gap-3 flex-col sm:flex-row">
          <Input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Nhập kích thước mới"
            className="flex-1 rounded-xl border-2 border-gray-200 transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500 text-base px-4 py-3"
          />
          <Button 
            onClick={handleAddSize} 
            size="lg" 
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
            disabled={!newSize.trim()}
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm
          </Button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {sizes.map((size) => (
              <div key={size} className="bg-orange-50 rounded-full px-5 py-2 flex items-center gap-2 group hover:bg-orange-100 transition-all duration-200">
                <span className="text-base font-semibold text-orange-700">{size}</span>
                <button 
                  onClick={() => handleRemoveSize(size)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1"
                >
                  <X className="w-4 h-4 text-orange-500 hover:text-orange-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-500" />
            Màu sắc
          </Label>
          {colors.length === 0 && (
            <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-4 h-4" />
              Bắt buộc
            </span>
          )}
        </div>
        <div className="flex gap-3 flex-col sm:flex-row">
          <Input
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Nhập màu sắc mới"
            className="flex-1 rounded-xl border-2 border-gray-200 transition-all duration-200 hover:border-orange-500 focus:border-orange-500 focus:ring-orange-500 text-base px-4 py-3"
          />
          <Button 
            onClick={handleAddColor} 
            size="lg" 
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200"
            disabled={!newColor.trim()}
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm
          </Button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {colors.map((color) => (
              <div key={color} className="bg-orange-50 rounded-full px-5 py-2 flex items-center gap-2 group hover:bg-orange-100 transition-all duration-200">
                <span className="text-base font-semibold text-orange-700">{color}</span>
                <button 
                  onClick={() => handleRemoveColor(color)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1"
                >
                  <X className="w-4 h-4 text-orange-500 hover:text-orange-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 