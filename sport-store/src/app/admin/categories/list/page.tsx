"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CategorySearch from "@/components/admin/categories/list/categorySearch";
import CategoryTable from "@/components/admin/categories/list/categoryTable";
import Pagination from "@/components/admin/categories/list/pagination";
import DeleteButton from "@/components/admin/categories/list/categoryButton";
import { fetchApi } from "@/utils/api";

interface Category {
  _id: string;
  name: string;
  productCount: number;
  createdAt: string;
  isActive: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Tính toán số trang và danh sách thể loại hiện tại
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const currentCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Lấy danh sách thể loại từ API
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchApi("/categories");

      if (!response.success) {
        toast.error(response.message || "Lỗi khi lấy danh sách thể loại");
        if (response.message?.includes("unauthorized") || response.message?.includes("forbidden")) {
          router.push("/login");
          return;
        }
        throw new Error(response.message);
      }

      const categoriesData = response.data as Category[];
      setCategories(categoriesData || []);
      setFilteredCategories(categoriesData || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
      toast.error("Không thể tải danh sách thể loại");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Lọc thể loại theo từ khóa tìm kiếm
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();
    const filtered = categories.filter((category) => {
      // Tìm kiếm theo tên thể loại
      return category.name?.toLowerCase().includes(lowercaseQuery);
    });
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [categories]);

  // Xử lý chọn/bỏ chọn thể loại
  const handleSelectCategory = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  }, []);

  // Xử lý xóa thể loại đã chọn
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedCategories.length) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedCategories.length} thể loại đã chọn?
Lưu ý: Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      // Xóa tuần tự để có thể xử lý lỗi cho từng thể loại
      for (const id of selectedCategories) {
        const response = await fetchApi(`/categories/admin/${id}`, {
          method: "DELETE",
        });

        if (!response.success) {
          const errorMessage = response.message || "Có lỗi xảy ra khi xóa thể loại";
          if (errorMessage.includes("forbidden")) {
            toast.error("Bạn không có quyền xóa thể loại");
            return;
          }
          if (errorMessage.includes("not found")) {
            toast.error(`Không tìm thấy thể loại với ID: ${id}`);
            continue;
          }
          throw new Error(errorMessage);
        }
      }

      toast.success(`Đã xóa thành công ${selectedCategories.length} thể loại`);
      setSelectedCategories([]);
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa thể loại:", error);
      toast.error("Không thể xóa một số thể loại. Vui lòng thử lại sau");
    }
  }, [selectedCategories, fetchCategories]);

  // Tải danh sách thể loại khi component được mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DANH SÁCH THỂ LOẠI
              </h1>
              {isLoading && (
                <div className="mt-2 flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Đang tải...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <CategorySearch
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSearch(searchQuery);
              }}
            />
            <DeleteButton
              selectedCount={selectedCategories.length}
              onDelete={handleDeleteSelected}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <CategoryTable
              categories={currentCategories}
              selectedCategories={selectedCategories}
              onSelectCategory={handleSelectCategory}
              onDeleteCategory={handleDeleteSelected}
            />
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}