"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import { customerService } from "@/services/customerService";
import { CustomerTable } from "@/components/admin/customers/list/customerTable";
import { CustomerSearch } from "@/components/admin/customers/list/customerSearch";
import { Button } from "@/components/ui/button";

type FilterState = {
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export default function CustomerList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers();
      if (response.success) {
        setCustomers(response.data.customers);
      } else {
        setError(response.message || "Không thể tải danh sách khách hàng");
        toast.error(response.message || "Không thể tải danh sách khách hàng");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Có lỗi xảy ra khi tải danh sách khách hàng");
      toast.error("Có lỗi xảy ra khi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer._id !== id));
    toast.success("Xóa khách hàng thành công");
  };

  const handleViewDetails = (id: string) => {
    router.push(`/admin/customers/details/${id}`);
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search logic
    console.log("Searching for:", query);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    // TODO: Implement filter logic
    console.log("Applying filters:", newFilters);
  };

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center space-y-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchCustomers}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1920px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Khách hàng</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Quản lý danh sách khách hàng của bạn
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Tổng số: {customers.length} khách hàng
        </div>
      </div>

      <CustomerSearch onSearch={handleSearch} onFilterChange={handleFilterChange} />

      <div className="overflow-x-auto">
        <CustomerTable
          customers={customers}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}