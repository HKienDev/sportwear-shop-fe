"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit, Power, MoreHorizontal, Loader2, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/types/category";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import CategoryFilter from "./categoryFilter";
import categoryService from "@/services/categoryService";
import { CategoryQueryParams } from "@/types/category";
import { Input } from "@/components/ui/input";

interface CategoryTableProps {
  searchQuery?: string;
  filters?: {
    status: string | null;
  };
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: { status: string | null }) => void;
}

type SortField = "name" | "createdAt" | "status" | "productCount";
type SortOrder = "asc" | "desc";

export default function CategoryTable({
  searchQuery = "",
  filters = { status: null },
  onSearch = () => {},
  onFilterChange = () => {},
}: CategoryTableProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: CategoryQueryParams = {
        page,
        limit,
        ...(searchQuery && { 
          search: searchQuery 
        }),
        ...(filters.status && !searchQuery && { isActive: filters.status === "active" }),
        sort: sortField,
        order: sortOrder,
        _t: Date.now()
      };

      console.log('Fetching categories with params:', params);
      
      const response = await categoryService.getAllCategories(params);
      console.log('API Response:', response);

      if (response.success) {
        setCategories(response.data.categories || []);
        setTotal(response.data.pagination?.total || 0);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách danh mục');
      } else {
        toast.error('Có lỗi xảy ra khi tải danh sách danh mục');
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, filters, sortField, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const handleFilterChange = (newFilters: { status: string | null }) => {
    onFilterChange(newFilters);
    setPage(1);
  };

  const handleEdit = (categoryId: string) => {
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      setLoadingId(categoryId);
      console.log("Toggling status for category:", categoryId);
      console.log("Current status:", currentStatus);
      console.log("New status:", !currentStatus);
      
      const response = await categoryService.updateCategory(categoryId, {
        isActive: !currentStatus
      });

      if (response.success) {
        toast.success(
          `Đã ${!currentStatus ? "Kích hoạt" : "Tạm dừng"} danh mục`
        );
        fetchCategories();
      } else {
        throw new Error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setLoadingId(categoryToDelete);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Đã xóa danh mục thành công");
        fetchCategories();
      } else {
        throw new Error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoadingId(null);
      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <Card className="w-full card">
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="space-y-1">
            <CardTitle className="card-title text-[clamp(0.875rem,2vw,1.5rem)] font-semibold">
              Danh sách danh mục
            </CardTitle>
            <CardDescription className="card-description text-[clamp(0.75rem,1.5vw,1rem)]">
              Quản lý tất cả danh mục sản phẩm trong hệ thống
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full sm:w-[200px]"
            />
            <CategoryFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <Button
              onClick={() => router.push("/admin/categories/add")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm danh mục</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã</TableHead>
                <TableHead className="w-[100px]">Ảnh</TableHead>
                <TableHead className="min-w-[200px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Tên danh mục
                    {renderSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("productCount")}
                  >
                    Số sản phẩm
                    {renderSortIcon("productCount")}
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Trạng thái
                    {renderSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    Ngày tạo
                    {renderSortIcon("createdAt")}
                  </div>
                </TableHead>
                <TableHead className="w-[100px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Không tìm thấy danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.categoryId}</TableCell>
                    <TableCell>
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.productCount || 0} sản phẩm
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "success" : "destructive"}
                      >
                        {category.isActive ? "Hoạt động" : "Tạm dừng"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={loadingId === category._id}
                          >
                            <span className="sr-only">Mở menu</span>
                            {loadingId === category._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(category._id)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(category._id, category.isActive)
                            }
                          >
                            <Power className="w-4 h-4 mr-2" />
                            {category.isActive ? "Tạm dừng" : "Kích hoạt"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(category._id)}
                            className="text-destructive"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trước
            </Button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}