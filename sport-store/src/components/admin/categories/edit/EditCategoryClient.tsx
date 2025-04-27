"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Category } from "@/types/category";
import CategoryForm from "./CategoryForm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCategoryClient({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchWithAuth<Category>(`/categories/${categoryId}`);
        
        if (response.success && response.data) {
          setCategory(response.data);
        } else {
          setError(response.message || "Không thể tải thông tin danh mục");
          toast.error(response.message || "Không thể tải thông tin danh mục");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tải thông tin danh mục";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSave = async (formData: Partial<Category>) => {
    if (!category) return;
    
    try {
      setSaving(true);
      const response = await fetchWithAuth<Category>(`/categories/${category.categoryId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        toast.success("Cập nhật danh mục thành công");
        router.push("/admin/categories/list");
      } else {
        toast.error(response.message || "Không thể cập nhật danh mục");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật danh mục";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories/list");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-lg font-medium text-red-800">Không thể tải thông tin danh mục</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <button
          onClick={() => router.push("/admin/categories/list")}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h2 className="text-lg font-medium text-amber-800">Không tìm thấy danh mục</h2>
        <p className="mt-2 text-amber-700">Danh mục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={() => router.push("/admin/categories/list")}
          className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa danh mục</h1>
        <p className="text-muted-foreground">
          Cập nhật thông tin danh mục sản phẩm
        </p>
      </div>
      <CategoryForm
        category={category}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}