"use client";
import React from "react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Edit, Power, Trash, ChevronLeft, ChevronRight } from "lucide-react";
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
import categoryService from "@/services/categoryService";
import { CategoryQueryParams } from "@/types/category";
import CategoryStatusBadge from "./categoryStatusBadge";
import Image from "next/image";

interface CategoryTableProps {
  categories: Category[];
  selectedCategories: string[];
  onToggleSelectAll: () => void;
  onToggleSelectCategory: (id: string) => void;
  searchQuery?: string;
  filters?: {
    status: string | null;
  };
}

const CategoryTable = React.memo(
  ({
    categories,
    selectedCategories,
    onToggleSelectAll,
    onToggleSelectCategory,
    searchQuery = "",
    filters = { status: null },
  }: CategoryTableProps) => {
    const router = useRouter();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [localCategories, setLocalCategories] = useState<Category[]>([]);
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    // Cập nhật localCategories khi categories thay đổi
    useEffect(() => {
      setLocalCategories(categories);
    }, [categories]);

    const fetchCategories = useCallback(async () => {
      try {
        const params: CategoryQueryParams = {
          page,
          limit,
          ...(searchQuery && { search: searchQuery }),
          ...(filters.status && !searchQuery && { isActive: filters.status === "active" }),
          _t: Date.now(),
        };
        const response = await categoryService.getAllCategories(params);
        if (response.success) {
          setTotal(response.data.pagination?.total || 0);
        } else {
          toast.error(response.message || "Có lỗi xảy ra khi tải danh sách danh mục");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi tải danh sách danh mục");
      }
    }, [page, limit, searchQuery, filters]);

    useEffect(() => {
      const timer = setTimeout(() => {
        fetchCategories();
      }, 300);
      return () => clearTimeout(timer);
    }, [fetchCategories]);

    const handleEdit = (categoryId: string) => {
      const category = localCategories.find(cat => cat._id === categoryId);
      if (category) {
        router.push(`/admin/categories/edit/${category.categoryId}`);
      }
    };

    const handleToggleStatus = async (categoryId: string, currentStatus: boolean) => {
      try {
        // Cập nhật trạng thái ngay lập tức trong UI
        setLocalCategories(prevCategories => 
          prevCategories.map(category => {
            if (category._id === categoryId) {
              return { ...category, isActive: !currentStatus };
            }
            return category;
          })
        );
        
        // Gọi API để cập nhật trạng thái
        const response = await categoryService.updateCategory(categoryId, {
          isActive: !currentStatus,
        });
        
        if (response.success) {
          toast.success(`Đã ${!currentStatus ? "Kích hoạt" : "Tạm dừng"} danh mục`);
          // Cập nhật lại danh sách từ server
          fetchCategories();
        } else {
          // Nếu API thất bại, hoàn tác lại trạng thái
          setLocalCategories(prevCategories => 
            prevCategories.map(category => {
              if (category._id === categoryId) {
                return { ...category, isActive: currentStatus };
              }
              return category;
            })
          );
          toast.error(response.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        // Nếu có lỗi, hoàn tác lại trạng thái
        setLocalCategories(prevCategories => 
          prevCategories.map(category => {
            if (category._id === categoryId) {
              return { ...category, isActive: currentStatus };
            }
            return category;
          })
        );
        console.error("Error toggling category status:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
      }
    };

    const handleDelete = async (categoryId: string) => {
      setCategoryToDelete(categoryId);
      setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
      if (!categoryToDelete) return;
      try {
        // Cập nhật UI ngay lập tức
        setLocalCategories(prevCategories => 
          prevCategories.filter(category => category._id !== categoryToDelete)
        );
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToDelete}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Đã xóa danh mục thành công");
          // Không cần gọi fetchCategories() nữa vì đã cập nhật UI ngay lập tức
        } else {
          // Nếu API thất bại, hoàn tác lại trạng thái
          fetchCategories();
          throw new Error(data.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
      } finally {
        setCategoryToDelete(null);
        setDeleteDialogOpen(false);
      }
    };

    return (
      <div className="px-4 py-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-teal-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng Danh Mục</p>
                  <p className="text-2xl font-bold text-slate-800">{localCategories.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <span className="text-teal-500 text-xl font-bold">Σ</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Đang Hoạt Động</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {localCategories.filter((category) => category.isActive).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <span className="text-indigo-500 text-xl font-bold">⧗</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tạm Dừng</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {localCategories.filter((category) => !category.isActive).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-500 text-xl font-bold">⏸️</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-rose-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Có Sản Phẩm</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {localCategories.filter((category) => category.productCount > 0).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center">
                  <span className="text-rose-500 text-xl font-bold">P</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === localCategories.length && localCategories.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Tên Danh Mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Số Sản Phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Ngày Tạo
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {localCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => onToggleSelectCategory(category._id)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <span className="text-slate-500 text-sm font-medium">
                                  {category.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-slate-900">{category.name}</div>
                            <div className="text-slate-500">{category.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{category.slug}</td>
                      <td className="px-6 py-4 text-slate-500">{category.productCount}</td>
                      <td className="px-6 py-4">
                        <CategoryStatusBadge status={category.isActive ? "active" : "inactive"} />
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(category.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(category._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(category._id, category.isActive)}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            <Power className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="text-rose-600 hover:text-rose-900"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {localCategories.length > 0 && (
            <div className="flex flex-wrap justify-between items-center">
              <div className="text-sm text-slate-600 mb-2 sm:mb-0">
                Trang <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    page === 1
                      ? "text-slate-300 cursor-not-allowed bg-slate-50"
                      : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageToShow;
                  if (totalPages <= 5) {
                    pageToShow = i + 1;
                  } else if (page <= 3) {
                    pageToShow = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageToShow = totalPages - 4 + i;
                  } else {
                    pageToShow = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setPage(pageToShow)}
                      className={`w-10 h-10 rounded-lg text-center ${
                        page === pageToShow
                          ? "bg-teal-500 text-white font-medium"
                          : "text-slate-600 hover:bg-teal-50 bg-white border border-slate-200"
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg flex items-center justify-center ${
                    page === totalPages
                      ? "text-slate-300 cursor-not-allowed bg-slate-50"
                      : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
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
        </div>
      </div>
    );
  }
);

CategoryTable.displayName = "CategoryTable";
export default CategoryTable;