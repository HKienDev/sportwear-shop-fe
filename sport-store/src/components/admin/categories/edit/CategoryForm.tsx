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
              c.categoryId !== category.categoryId
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
    [category.categoryId]
  );

  // Kiểm tra tên khi formData.name thay đổi
  useEffect(() => {
    const debouncedCheck = debounce(checkCategoryName, 300);
    debouncedCheck(formData.name || "");
    return () => debouncedCheck.cancel();
  }, [formData.name, checkCategoryName]);

  // Debug logging khi formData thay đổi
  useEffect(() => {
    console.log("🔄 FormData updated:", formData);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submitted with data:", formData);
    if (nameError) {
      toast.error("Vui lòng sửa lỗi trước khi lưu", {
        duration: 3000,
      });
      return;
    }
    onSave(formData);
  };

  const handleImageUpload = (url: string) => {
    console.log("🖼️ Image upload triggered:", url);
    setFormData((prev) => ({ ...prev, image: url }));
    toast.success("Ảnh đã được cập nhật!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 tracking-wide">
              Tên danh mục
            </Label>
            <div className="relative group">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className={`transition-all duration-300 ${
                  nameError 
                    ? "border-red-400 focus:ring-red-400/30" 
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-400/30"
                } group-hover:border-gray-300 pr-8 rounded-xl bg-white/50 backdrop-blur-sm`}
                placeholder="Nhập tên danh mục"
              />
              {isCheckingName && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                </div>
              )}
            </div>
            {nameError && (
              <p className="text-sm text-red-500 mt-1 flex items-center animate-fade-in">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 tracking-wide">
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={4}
              className="resize-none transition-all duration-300 border-gray-200 focus:border-blue-400 focus:ring-blue-400/30 rounded-xl bg-white/50 backdrop-blur-sm"
              placeholder="Nhập mô tả cho danh mục"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-white/20">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
            />
            <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              {formData.isActive ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Đang kích hoạt
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Đang ẩn
                </span>
              )}
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-700 tracking-wide">
            Ảnh danh mục
          </Label>
          <ImageUpload
            value={formData.image || ""}
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="transition-all duration-300 hover:bg-gray-50 rounded-xl border-gray-200"
        >
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={saving || !!nameError || isCheckingName}
          className="transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-500/20"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Đang lưu...
            </div>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>
    </form>
  );
} 