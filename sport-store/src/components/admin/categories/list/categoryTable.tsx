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
import { toast } from "sonner";

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
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(filters.status && !searchQuery && { isActive: filters.status === "active" ? "true" : "false" }),
          _t: Date.now().toString(),
        });
        
        const response = await fetch(`/api/categories/admin?${params}`, {
          credentials: "include",
        });
        
        const data = await response.json();
        if (data.success) {
          setTotal(data.data.pagination?.total || 0);
        } else {
          toast.error(data.message || "Có lỗi xảy ra khi tải danh sách danh mục");
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
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ isActive: Boolean(!currentStatus) })
        });
        
        const data = await response.json();
        
        if (data.success) {
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
          toast.error(data.message || "Có lỗi xảy ra");
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
        
        const response = await fetch(`/api/categories/${categoryToDelete}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
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
      <div className="px-4 py-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === localCategories.length && localCategories.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-48">
                      Tên Danh Mục
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">
                      Mã Danh Mục
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">
                      Số Sản Phẩm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-40">
                      Trạng Thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {localCategories.length > 0 ? (
                    localCategories.map((category, index) => (
                      <tr key={category._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50 transition-colors duration-150`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => onToggleSelectCategory(category._id)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {category.image && (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 mr-3">
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-slate-800 truncate">
                                {category.name}
                              </div>
                              <div className="text-slate-500 text-sm truncate">
                                {category.description || "Không có mô tả"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-800 font-mono">
                            {category.categoryId}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-slate-800 whitespace-nowrap">
                            {category.productCount || 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <CategoryStatusBadge status={category.isActive ? "active" : "inactive"} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(category._id)}
                              className="p-1 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(category._id, category.isActive)}
                              className={`p-1 rounded-full transition-colors ${
                                category.isActive
                                  ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              }`}
                              title={category.isActive ? "Tạm dừng" : "Kích hoạt"}
                            >
                              <Power size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                              title="Xóa"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-slate-500 py-4">
                        Không có danh mục nào
                      </td>
                    </tr>
                  )}
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