import EditCategoryClient from "@/components/admin/categories/edit/EditCategoryClient";

interface EditCategoryPageProps {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata(props: EditCategoryPageProps) {
  const params = await Promise.resolve(props.params);
  const id = params.id;
  return {
    title: `Chỉnh sửa danh mục ${id}`,
  };
}

export default async function EditCategoryPage(props: EditCategoryPageProps) {
  const params = await Promise.resolve(props.params);
  const id = params.id;
  return <EditCategoryClient categoryId={id} />;
} 