"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CategorySearch from "@/components/admin/categories/list/categorySearch";
import CategoryTable from "@/components/admin/categories/list/categoryTable";
import Pagination from "@/components/admin/categories/list/pagination";
import DeleteButton from "@/components/admin/categories/list/categoryButton";
import { useAuth } from "@/context/authContext";

interface Category {
  _id: string;
  name: string;
  productCount: number;
  createdAt: string;
  isActive: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function CategoryList() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Lấy danh sách thể loại từ API
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/categories/admin?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi lấy danh sách thể loại");
      }

      if (!data.success) {
        throw new Error(data.message || "Có lỗi xảy ra khi lấy danh sách thể loại");
      }

      setCategories(data.data.categories || []);
      setTotalPages(data.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách thể loại");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý tìm kiếm
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

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
        const response = await fetch(`/api/categories/admin/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Có lỗi xảy ra khi xóa thể loại");
        }
      }

      toast.success("Xóa thể loại thành công");
      fetchCategories();
      setSelectedCategories([]);
    } catch (error) {
      console.error("Lỗi khi xóa thể loại:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa thể loại");
    }
  }, [selectedCategories, fetchCategories]);

  // Xử lý chuyển trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý thể loại</h1>
        <button
          onClick={() => router.push("/admin/categories/add")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm thể loại mới
        </button>
      </div>

      <CategorySearch onSearch={handleSearch} />
      
      <div className="mt-4">
        <CategoryTable
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectCategory={handleSelectCategory}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <DeleteButton
          selectedCount={selectedCategories.length}
          onDelete={handleDeleteSelected}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}