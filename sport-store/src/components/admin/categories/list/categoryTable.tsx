"use client";
import React from "react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Power, Trash } from "lucide-react";
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

import CategoryStatusBadge from "./categoryStatusBadge";

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
    const [limit] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [localCategories, setLocalCategories] = useState<Category[]>([]);

    // Cập nhật localCategories khi categories thay đổi
    useEffect(() => {
      setLocalCategories(categories);
    }, [categories]);

    const fetchCategories = useCallback(async () => {
      try {
        const params = new URLSearchParams({
          page: "1", // Always fetch page 1 for now
          limit: limit.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(filters.status && !searchQuery && { isActive: filters.status === "active" ? "true" : "false" }),
          _t: Date.now().toString(),
        });
        
        const response = await fetch(`/api/categories/admin?${params}`, {
          credentials: "include",
        });
        
        const data = await response.json();
        if (!data.success) {
          toast.error(data.message || "Có lỗi xảy ra khi tải danh sách danh mục");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi tải danh sách danh mục");
      }
    }, [limit, searchQuery, filters]);

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
      <div className="space-y-6">
        {/* Table Container with Enhanced Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/60">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm">
                    <th className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === localCategories.length && localCategories.length > 0}
                        onChange={onToggleSelectAll}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Tên danh mục</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Mã danh mục</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Số sản phẩm</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {localCategories.length > 0 ? (
                    localCategories.map((category, index) => (
                      <tr key={category._id} className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-emerald-50/50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                      }`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category._id)}
                            onChange={() => onToggleSelectCategory(category._id)}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">
                          {category.categoryId}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-800">
                          {category.productCount || 0}
                        </td>
                        <td className="px-6 py-4">
                          <CategoryStatusBadge status={category.isActive ? "active" : "inactive"} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(category._id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(category._id, category.isActive)}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${category.isActive ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "bg-green-100 text-green-600 hover:bg-green-200"} transition-all duration-200`}
                            >
                              <Power size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all duration-200"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-4 p-4 rounded-full bg-slate-100">
                            <Edit size={32} className="text-slate-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-800 mb-1">Không tìm thấy danh mục</p>
                          <p className="text-slate-500">Hiện tại chưa có danh mục nào trong hệ thống</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

          {/* Pagination Component */}
          {/* (KHÔNG render Pagination ở đây nữa) */}

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
    );
  }
);

CategoryTable.displayName = "CategoryTable";
export default CategoryTable;