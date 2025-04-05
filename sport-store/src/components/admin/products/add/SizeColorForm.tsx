import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { ProductFormData } from "@/types/product";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-medium text-gray-700">KÍCH THƯỚC</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Nhập size mới"
            className="flex-1"
          />
          <Button 
            onClick={handleAddSize} 
            size="sm" 
            className="shrink-0"
            disabled={!newSize.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {sizes.map((size) => (
              <div key={size} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1 group hover:bg-gray-200 transition-colors">
                <span className="text-sm">{size}</span>
                <button 
                  onClick={() => handleRemoveSize(size)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700">MÀU SẮC</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="Nhập màu mới"
            className="flex-1"
          />
          <Button 
            onClick={handleAddColor} 
            size="sm" 
            className="shrink-0"
            disabled={!newColor.trim()}
          >
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {colors.map((color) => (
              <div key={color} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1 group hover:bg-gray-200 transition-colors">
                <span className="text-sm">{color}</span>
                <button 
                  onClick={() => handleRemoveColor(color)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 