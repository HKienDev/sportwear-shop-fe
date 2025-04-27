import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Category } from "@/types/category";
import CategoryForm from "@/components/admin/categories/edit/CategoryForm";

export const metadata: Metadata = {
  title: "Chỉnh sửa danh mục | Admin",
  description: "Chỉnh sửa thông tin danh mục sản phẩm",
};

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = params;

  try {
    const response = await fetchWithAuth<Category>(`/categories/${id}`);

    if (!response.success || !response.data) {
      notFound();
    }

    const category: Category = {
      ...response.data,
      categoryId: response.data._id,
      productCount: 0,
      createdBy: {
        _id: "admin",
        name: "Administrator"
      }
    };

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
          onSave={async (formData) => {
            // TODO: Implement save logic
            console.log("Saving category:", formData);
          }}
          onCancel={() => {
            // TODO: Implement cancel logic
            console.log("Canceling edit");
          }}
          saving={false}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }
} 