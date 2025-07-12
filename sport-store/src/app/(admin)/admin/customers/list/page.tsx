"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import { customerService } from "@/services/customerService";
import { CustomerTable } from "@/components/admin/customers/list/customerTable";
import { CustomerFilter } from "@/components/admin/customers/list/customerFilter";
import { CustomerStatusCards } from "@/components/admin/customers/list/customerStatusCards";
import { Pagination } from "@/components/admin/customers/list/pagination";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/authContext";
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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthenticated } = useAuth();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getCustomers();
      if (response.success) {
        setCustomers(response.data.users);
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

  const handleDelete = async (customId: string): Promise<void> => {
    setDeleteId(customId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      const toastId = toast.loading("Đang xóa khách hàng...");
      
      const response = await customerService.deleteCustomer(deleteId);
      if (response.success) {
        toast.success("Xóa khách hàng thành công", { id: toastId });
        fetchCustomers();
      } else {
        toast.error(response.message || "Không thể xóa khách hàng", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Đã xảy ra lỗi khi xóa khách hàng");
    } finally {
      setDeleteId(null);
      setIsDeleting(false);
    }
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

  const handleToggleStatus = async (customId: string) => {
    try {
      const customer = customers.find(c => 
        c.customId === customId || `VJUSPORTUSER-${c._id.slice(0, 8)}` === customId
      );
      if (!customer) {
        toast.error("Không tìm thấy khách hàng");
        return;
      }
      
      const toastId = toast.loading(`Đang ${customer.isActive ? 'khóa' : 'mở khóa'} tài khoản "${customer.fullname}"...`);
      
      const response = await customerService.toggleUserStatus(customId);
      if (response.success) {
        toast.success(`Đã ${customer.isActive ? 'khóa' : 'mở khóa'} tài khoản "${customer.fullname}" thành công`, { id: toastId });
        // KHÔNG fetchCustomers() nữa để tránh reload bảng
      } else {
        toast.error(response.message || 'Cập nhật trạng thái thất bại', { id: toastId });
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer._id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // TODO: Implement pagination logic with API call
    console.log("Changing to page:", page);
  };

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="loading-animation mb-6">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2">Đang tải dữ liệu...</p>
              <p className="text-slate-500 text-center max-w-sm">Vui lòng chờ trong giây lát, chúng tôi đang xử lý yêu cầu của bạn</p>
              <style jsx>{`
                .loading-animation {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 12px;
                }
                
                .dot {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: linear-gradient(to right, #4f46e5, #10b981);
                  animation: bounce 1.5s infinite ease-in-out;
                }
                
                .dot:nth-child(1) {
                  animation-delay: 0s;
                }
                
                .dot:nth-child(2) {
                  animation-delay: 0.2s;
                }
                
                .dot:nth-child(3) {
                  animation-delay: 0.4s;
                }
                
                @keyframes bounce {
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-20px);
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
        <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 relative mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-300 to-rose-400 opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <AlertCircle size={32} className="text-rose-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Đã xảy ra lỗi</h3>
              <p className="text-slate-600 max-w-md mb-6 text-lg">{error}</p>
              <Button 
                onClick={fetchCustomers}
                className="px-6 py-3 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 rounded-xl hover:from-rose-100 hover:to-rose-200 transition-all duration-300 font-semibold border border-rose-200/60"
              >
                Thử lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with Enhanced 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight relative">
                    Quản lý khách hàng
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 max-w-2xl text-lg">
                    Xem và quản lý tất cả thông tin khách hàng trong hệ thống với giao diện hiện đại
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Hệ thống hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6">
          <CustomerFilter onSearch={handleSearch} onFilterChange={handleFilterChange} />
        </div>

        {/* Status Cards Section */}
        <div className="mb-6">
          <CustomerStatusCards customers={customers} />
        </div>

        {/* Table Section with Enhanced Glass Effect */}
        <div className="relative">
          {customers.length === 0 ? (
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg
                      className="w-16 h-16 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      ></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy khách hàng</h3>
                <p className="text-slate-600 max-w-md mb-6 text-lg">
                  Hiện không có khách hàng nào phù hợp với điều kiện tìm kiếm của bạn. 
                  Hãy thử điều chỉnh bộ lọc hoặc tạo khách hàng mới.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {}}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-emerald-100 transition-all duration-300 font-semibold border border-indigo-200/60"
                  >
                    Xóa bộ lọc
                  </button>
                  <button 
                    onClick={() => router.push("/admin/customers/add")}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 text-white rounded-xl hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25"
                  >
                    Tạo khách hàng mới
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
                <div className="bg-white/90 backdrop-blur-sm bg-opacity-80 rounded-3xl shadow-xl border border-indigo-100/60 overflow-hidden relative z-10">
                  <CustomerTable
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    onSelectCustomer={handleSelectCustomer}
                    onSelectAll={handleSelectAll}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={1}
                  totalItems={0}
                  onPageChange={handlePageChange}
                  itemsPerPage={10}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* AlertDialog xác nhận xóa */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-indigo-100/60 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800 font-bold">Bạn có chắc chắn muốn xóa khách hàng này?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn khách hàng khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 disabled:opacity-50"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}