"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import CustomerSearch from "@/components/admin/customers/list/customerSearch";
import CustomerTable from "@/components/admin/customers/list/customerTable";
import Pagination from "@/components/admin/customers/list/pagination";
import DeleteButton from "@/components/admin/customers/list/deleteButton";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Customer {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  username: string;
  avatar: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  address: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  dob: string;
  gender: string;
  membershipLevel: string;
  totalSpent: number;
  orderCount: number;
  lastActivity: string;
}

const ITEMS_PER_PAGE = 10;

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Tính toán số trang và danh sách khách hàng hiện tại
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Lấy danh sách khách hàng từ API
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth("/users");

      if (!response.success) {
        throw new Error(response.message || "Lỗi khi lấy danh sách khách hàng");
      }

      if (!response.data) {
        throw new Error("Không có dữ liệu khách hàng");
      }
      
      // Lọc chỉ lấy user (không lấy admin)
      const userCustomers = (response.data as Customer[]).filter((customer) => customer.role === "user");
      setCustomers(userCustomers);
      setFilteredCustomers(userCustomers);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách khách hàng");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lọc khách hàng theo từ khóa tìm kiếm
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();
    const filtered = customers.filter((customer) => {
      // Tìm kiếm theo tên đầy đủ
      const fullnameMatch = customer.fullname?.toLowerCase().includes(lowercaseQuery);
      // Tìm kiếm theo số điện thoại
      const phoneMatch = customer.phone?.includes(query);
      // Tìm kiếm theo email
      const emailMatch = customer.email?.toLowerCase().includes(lowercaseQuery);
      
      return fullnameMatch || phoneMatch || emailMatch;
    });
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [customers]);

  // Xử lý chọn/bỏ chọn khách hàng
  const handleSelectCustomer = useCallback((id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id]
    );
  }, []);

  // Xử lý xóa khách hàng đã chọn
  const handleDeleteSelected = useCallback(async () => {
    if (!selectedCustomers.length) return;
    
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedCustomers.length} khách hàng đã chọn?
Lưu ý: Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      // Xóa tuần tự để có thể xử lý lỗi cho từng user
      for (const id of selectedCustomers) {
        const response = await fetchWithAuth(`/users/admin/${id}`, { 
          method: "DELETE"
        });

        if (!response.success) {
          throw new Error(response.message || "Có lỗi xảy ra khi xóa người dùng");
        }
      }
      
      toast.success(`Đã xóa thành công ${selectedCustomers.length} khách hàng`);
      setSelectedCustomers([]);
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      toast.error(error instanceof Error ? error.message : "Không thể xóa một số khách hàng. Vui lòng thử lại sau");
    }
  }, [selectedCustomers, fetchCustomers]);

  // Tải danh sách khách hàng khi component được mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        DANH SÁCH KHÁCH HÀNG
        {isLoading && <span className="ml-2 text-gray-500 text-sm">(Đang tải...)</span>}
      </h1>

      <div className="flex justify-between mb-4">
        <CustomerSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
        />
        <DeleteButton
          selectedCount={selectedCustomers.length}
          onDelete={handleDeleteSelected}
        />
      </div>

      <CustomerTable
        customers={currentCustomers}
        selectedCustomers={selectedCustomers}
        onSelectCustomer={handleSelectCustomer}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}