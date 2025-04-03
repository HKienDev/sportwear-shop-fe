"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import categoryService from "@/services/categoryService";
import debounce from "lodash/debounce";

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
    image: category.image || "",
    isActive: category.isActive,
  });
  const [nameError, setNameError] = useState<string>("");
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Hàm kiểm tra tên danh mục trùng lặp
  const checkCategoryName = useCallback(
    async (name: string) => {
      if (!name) {
        setNameError("");
        setIsCheckingName(false);
        return;
      }

      try {
        setIsCheckingName(true);
        const response = await categoryService.searchCategories(name);
        if (
          response.success &&
          response.data.categories?.some(
            (c) =>
              c.name.toLowerCase() === name.toLowerCase() &&
              c._id !== category._id
          )
        ) {
          setNameError("Tên danh mục đã được sử dụng");
          toast.error("Tên danh mục đã được sử dụng", {
            description: "Vui lòng chọn tên khác",
            duration: 3000,
          });
        } else {
          setNameError("");
        }
      } catch (error) {
        console.error("Error checking category name:", error);
      } finally {
        setIsCheckingName(false);
      }
    },
    [category._id]
  );

  // Kiểm tra tên khi formData.name thay đổi
  useEffect(() => {
    const debouncedCheck = debounce(checkCategoryName, 300);
    debouncedCheck(formData.name || "");
    return () => debouncedCheck.cancel();
  }, [formData.name, checkCategoryName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError) {
      toast.error("Vui lòng sửa lỗi trước khi lưu", {
        duration: 3000,
      });
      return;
    }
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
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className={nameError ? "border-red-500 pr-8" : "pr-8"}
              />
              {isCheckingName && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
            {nameError && (
              <p className="text-sm text-red-500 mt-1">{nameError}</p>
            )}
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
              value={formData.image || ""}
              onChange={handleImageUpload}
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
        <Button type="submit" disabled={saving || !!nameError || isCheckingName}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
} 