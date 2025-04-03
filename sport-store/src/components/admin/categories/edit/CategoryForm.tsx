"use client";

import { useState } from "react";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";

interface CategoryFormProps {
  category: Category;
  onSave: (formData: Partial<Category>) => void;
  onCancel: () => void;
  saving: boolean;
}

export default function CategoryForm({
  category,
  onSave,
  onCancel,
  saving,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: category.name,
    description: category.description,
    image: category.image,
    isActive: category.isActive,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tên danh mục</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="isActive">Kích hoạt</Label>
          </div>
        </div>

        <div>
          <Label>Ảnh danh mục</Label>
          <div className="mt-2">
            <ImageUpload
              value={formData.image}
              onChange={handleImageUpload}
              onRemove={() => setFormData((prev) => ({ ...prev, image: "" }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
} 