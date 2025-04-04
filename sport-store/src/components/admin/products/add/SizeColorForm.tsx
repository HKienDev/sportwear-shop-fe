import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { ProductFormData, ProductFormErrors } from "@/types/product";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface SizeColorFormProps {
  data: Pick<ProductFormData, 'sizes' | 'colors'>;
  errors: Pick<ProductFormErrors, 'sizes' | 'colors'>;
  onChange: (field: 'sizes' | 'colors', value: string[]) => void;
}

export default function SizeColorForm({
  data,
  errors,
  onChange,
}: SizeColorFormProps) {
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    
    if (data.sizes.includes(newSize.trim())) {
      toast.error('Kích thước này đã tồn tại');
      return;
    }

    onChange('sizes', [...data.sizes, newSize.trim()]);
    setNewSize("");
  };

  const handleAddColor = () => {
    if (!newColor.trim()) return;
    
    if (data.colors.includes(newColor.trim())) {
      toast.error('Màu sắc này đã tồn tại');
      return;
    }

    onChange('colors', [...data.colors, newColor.trim()]);
    setNewColor("");
  };

  const handleRemoveSize = (size: string) => {
    onChange('sizes', data.sizes.filter(s => s !== size));
  };

  const handleRemoveColor = (color: string) => {
    onChange('colors', data.colors.filter(c => c !== color));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">KÍCH THƯỚC</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Nhập size mới"
              className={`flex-1 ${errors.sizes ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
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
          {errors.sizes && (
            <p className="mt-1 text-sm text-red-500">{errors.sizes}</p>
          )}
          {data.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.sizes.map((size) => (
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
          <div className="flex gap-2 mt-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Nhập màu mới"
              className={`flex-1 ${errors.colors ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
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
          {errors.colors && (
            <p className="mt-1 text-sm text-red-500">{errors.colors}</p>
          )}
          {data.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.colors.map((color) => (
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
    </div>
  );
} 