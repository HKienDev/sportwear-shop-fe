"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CategorySearch from "@/components/admin/categories/list/categorySearch";
import CategoryTable from "@/components/admin/categories/list/categoryTable";
import Pagination from "@/components/admin/categories/list/pagination";
import DeleteButton from "@/components/admin/categories/list/categoryButton";
import { fetchApi } from "@/utils/api";
import type { ApiResponse } from "@/types/api";

interface Category {
  _id: string;
  name: string;
  productCount: number;
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        DANH SÁCH THỂ LOẠI
        {isLoading && <span className="ml-2 text-gray-500 text-sm">(Đang tải...)</span>}
      </h1>

      <div className="flex justify-between mb-4">
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

      {/* Truyền danh sách thể loại vào bảng */}
      <CategoryTable
        categories={currentCategories}
        selectedCategories={selectedCategories}
        onSelectCategory={handleSelectCategory}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}