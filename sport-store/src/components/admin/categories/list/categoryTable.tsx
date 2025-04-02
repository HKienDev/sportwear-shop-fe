"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types/category";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CategoryTable() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchCategories = useCallback(async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/categories?page=${page}&limit=${limit}&query=${searchQuery}`;
      console.log("Fetching categories from:", apiUrl);

      const response = await fetch(apiUrl, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Categories response:", data);

      if (data.success) {
        setCategories(data.data.categories);
        setTotal(data.data.pagination.total);
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi tải danh sách danh mục");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Có lỗi xảy ra khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleEdit = (categoryId: string) => {
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Xóa danh mục thành công");
        fetchCategories();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi xóa danh mục");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Có lỗi xảy ra khi xóa danh mục");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="space-y-1">
            <CardTitle className="text-[clamp(0.875rem,2vw,1.5rem)] font-semibold">Danh sách danh mục</CardTitle>
            <CardDescription className="text-[clamp(0.75rem,1.5vw,1rem)]">
              Quản lý tất cả danh mục sản phẩm trong hệ thống
            </CardDescription>
          </div>
          <Button 
            onClick={() => router.push("/admin/categories/add")}
            className="w-full sm:w-auto text-[clamp(0.75rem,1.5vw,1rem)]"
          >
            <Plus className="w-[clamp(0.875rem,1.5vw,1.25rem)] h-[clamp(0.875rem,1.5vw,1.25rem)] mr-2" />
            Thêm danh mục
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center mb-3 sm:mb-4 md:mb-6">
          <div className="relative flex-1 max-w-[clamp(200px,30vw,400px)]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-[clamp(0.875rem,1.5vw,1.25rem)] h-[clamp(0.875rem,1.5vw,1.25rem)]" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 sm:pl-10 text-[clamp(0.75rem,1.5vw,1rem)]"
            />
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[clamp(60px,8vw,100px)] text-[clamp(0.75rem,1.5vw,1rem)]">Mã danh mục</TableHead>
                <TableHead className="w-[clamp(60px,8vw,100px)] text-[clamp(0.75rem,1.5vw,1rem)]">Ảnh</TableHead>
                <TableHead className="text-[clamp(0.75rem,1.5vw,1rem)]">Tên danh mục</TableHead>
                <TableHead className="hidden md:table-cell text-[clamp(0.75rem,1.5vw,1rem)]">Mô tả</TableHead>
                <TableHead className="w-[clamp(60px,8vw,100px)] text-[clamp(0.75rem,1.5vw,1rem)]">Trạng thái</TableHead>
                <TableHead className="w-[clamp(60px,8vw,100px)] text-[clamp(0.75rem,1.5vw,1rem)]">Nổi bật</TableHead>
                <TableHead className="hidden md:table-cell w-[clamp(120px,15vw,150px)] text-[clamp(0.75rem,1.5vw,1rem)]">Ngày tạo</TableHead>
                <TableHead className="w-[clamp(60px,8vw,100px)] text-right text-[clamp(0.75rem,1.5vw,1rem)]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: limit }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-[clamp(1rem,2vw,1.5rem)] w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground h-[clamp(6rem,15vw,8rem)] text-[clamp(0.75rem,1.5vw,1rem)]">
                    Không có danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell className="font-medium text-[clamp(0.75rem,1.5vw,1rem)]">
                      {category.categoryId}
                    </TableCell>
                    <TableCell>
                      {category.image ? (
                        <div className="relative w-[clamp(2.5rem,5vw,4rem)] h-[clamp(2.5rem,5vw,4rem)] rounded-lg overflow-hidden border">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 480px) 40px, (max-width: 768px) 48px, 64px"
                          />
                        </div>
                      ) : (
                        <div className="w-[clamp(2.5rem,5vw,4rem)] h-[clamp(2.5rem,5vw,4rem)] rounded-lg bg-muted flex items-center justify-center border">
                          <span className="text-muted-foreground text-[clamp(0.625rem,1.25vw,0.875rem)]">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-[clamp(0.75rem,1.5vw,1rem)]">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[clamp(150px,25vw,200px)] text-[clamp(0.75rem,1.5vw,1rem)]">
                      <p className="truncate" title={category.description || ""}>
                        {category.description || "—"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "success" : "secondary"}
                        className="text-[clamp(0.625rem,1.25vw,0.875rem)]"
                      >
                        {category.isActive ? "Hoạt động" : "Ẩn"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isFeatured ? "default" : "outline"}
                        className="text-[clamp(0.625rem,1.25vw,0.875rem)]"
                      >
                        {category.isFeatured ? "Có" : "Không"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-[clamp(0.75rem,1.5vw,1rem)]">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category.categoryId)}
                          className="h-[clamp(1.5rem,3vw,2.5rem)] w-[clamp(1.5rem,3vw,2.5rem)]"
                        >
                          <Edit className="w-[clamp(0.625rem,1.25vw,1rem)] h-[clamp(0.625rem,1.25vw,1rem)]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.categoryId)}
                          className="h-[clamp(1.5rem,3vw,2.5rem)] w-[clamp(1.5rem,3vw,2.5rem)]"
                        >
                          <Trash2 className="w-[clamp(0.625rem,1.25vw,1rem)] h-[clamp(0.625rem,1.25vw,1rem)]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
            <div className="text-[clamp(0.75rem,1.5vw,1rem)] text-muted-foreground">
              Hiển thị {categories.length} / {total} danh mục
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="text-[clamp(0.75rem,1.5vw,1rem)]"
              >
                Trước
              </Button>
              <div className="text-[clamp(0.75rem,1.5vw,1rem)]">
                Trang {page} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="text-[clamp(0.75rem,1.5vw,1rem)]"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}