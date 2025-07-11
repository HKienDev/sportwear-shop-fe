"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import { customerService } from "@/services/customerService";
import { CustomerTable } from "@/components/admin/customers/list/customerTable";
import { CustomerSearch } from "@/components/admin/customers/list/customerSearch";
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
      const response = await customerService.deleteCustomer(deleteId);
      if (response.success) {
        toast.success("Xóa khách hàng thành công");
        fetchCustomers();
      } else {
        toast.error(response.message || "Không thể xóa khách hàng");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Đã xảy ra lỗi khi xóa khách hàng");
    } finally {
      setDeleteId(null);
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
        fetchCustomers(); // Refresh data like products/list
      } else {
        toast.error(response.message || 'Cập nhật trạng thái thất bại', { id: toastId });
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40 flex items-center justify-center">
        <div className="p-12 flex flex-col items-center justify-center">
          <div className="loading-animation">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="mt-6 text-slate-500 font-medium">Đang tải dữ liệu...</p>
          <style jsx>{`
            .loading-animation {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;
            }
            
            .dot {
              width: 12px;
              height: 12px;
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
              0%, 80%, 100% { 
                transform: scale(0);
              }
              40% { 
                transform: scale(1.0);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40 flex items-center justify-center">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-300 to-rose-400 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <AlertCircle size={32} className="text-rose-400" />
            </div>
          </div>
          <h3 className="mt-6 text-lg font-medium text-slate-800">{error}</h3>
          <Button 
            onClick={fetchCustomers}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-600 rounded-lg hover:from-rose-100 hover:to-rose-200 transition-all duration-200 font-medium"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 to-indigo-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header with 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-indigo-600 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-600 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-white tracking-tight relative">
                Quản lý khách hàng
                <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
              </h1>
              <p className="text-indigo-50 mt-2 max-w-2xl text-opacity-90">
                Xem và quản lý tất cả thông tin khách hàng trong hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CustomerSearch onSearch={handleSearch} onFilterChange={handleFilterChange} />
        </div>

        {/* Table Container with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 opacity-5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-emerald-500 opacity-5 rounded-2xl transform -rotate-1"></div>
          <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-2xl shadow-lg border border-indigo-100/60 overflow-hidden relative z-10">
            {customers.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-300 to-emerald-300 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-indigo-400"
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
                <h3 className="mt-6 text-lg font-medium text-slate-800">Không tìm thấy khách hàng</h3>
                <p className="mt-2 text-slate-500 max-w-sm">
                  Hiện không có khách hàng nào phù hợp với điều kiện tìm kiếm của bạn.
                </p>
                <button
                  onClick={() => {}}
                  className="mt-6 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-emerald-50 text-indigo-600 rounded-lg hover:from-indigo-100 hover:to-emerald-100 transition-all duration-200 font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <CustomerTable
                customers={customers}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* AlertDialog xác nhận xóa */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa khách hàng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn khách hàng khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa khách hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}