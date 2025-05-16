import EditCategoryClient from "@/components/admin/categories/edit/EditCategoryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  return <EditCategoryClient categoryId={id} />;
} 