"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import CategoryForm from "@/components/admin/categories/edit/CategoryForm";
import CategoryInfo from "@/components/admin/categories/edit/CategoryInfo";
import ProductTable from "@/components/admin/categories/edit/ProductTable";
import categoryService from "@/services/categoryService";
import { Category } from "@/types/category";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCategoryPage({ params }: PageProps) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sử dụng React.use() để unwrap params
  const { id } = use(params);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategoryById(id);
        if (response.success && response.data.category) {
          setCategory(response.data.category);
        } else {
          toast.error(response.message || "Không tìm thấy danh mục");
          router.push("/admin/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Có lỗi xảy ra khi tải thông tin danh mục");
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  const handleSave = async (formData: Partial<Category>) => {
    try {
      setSaving(true);
      const response = await categoryService.updateCategory(id, formData);
      if (response.success && response.data.category) {
        toast.success("Cập nhật danh mục thành công");
        setCategory(response.data.category);
        setIsEditing(false);
      } else {
        throw new Error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/categories")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Chỉnh sửa danh mục" : "Chi tiết danh mục"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <CategoryForm
              category={category}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              saving={saving}
            />
          ) : (
            <CategoryInfo category={category} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable categoryId={category.categoryId} />
        </CardContent>
      </Card>
    </div>
  );
} 