"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Mail, Phone, Trash } from "lucide-react"; // Thêm các icon từ Lucide
import { useRouter } from "next/navigation";

interface Customer {
  _id: number;
  name: string;
  email: string;
  phone: string;
  lastActivity: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  role: string;
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const router = useRouter();

  const fetchCustomers = useCallback(async () => {
    if (typeof window === "undefined") {
      console.warn("Mã đang chạy trên server-side. Không thể truy cập localStorage.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }

      const url = new URL("http://localhost:4000/api/users");

      // Gọi API để lấy toàn bộ danh sách khách hàng
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        alert("Phiên đăng nhập hết hạn hoặc không có quyền truy cập.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const data: Customer[] = await response.json(); // Sử dụng kiểu Customer
      console.log("Dữ liệu từ API:", data);

      if (!Array.isArray(data)) {
        console.error("Dữ liệu từ API không hợp lệ:", data);
        setCustomers([]);
        return;
      }

      // Lọc danh sách khách hàng chỉ giữ lại những người có role là "user"
      const filteredData = data.filter((customer: Customer) => customer.role === "user");

      const totalPagesCount = Math.ceil(filteredData.length / 10);
      setTotalPages(totalPagesCount);

      setCurrentPage(1);
      setCustomers(filteredData.slice(0, 10)); // Chỉ lấy 10 khách hàng đầu tiên
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    fetchCustomers().catch((error) => {
      if (isMounted) {
        console.error("Lỗi trong useEffect:", error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchCustomers]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSelectCustomer = (id: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa các khách hàng đã chọn?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }

      await fetch("/api/customers/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedCustomers }),
      });
      fetchCustomers();
      setSelectedCustomers([]);
    } catch (error) {
      console.error("Error deleting customers:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold mb-4">DANH SÁCH KHÁCH HÀNG</h1>

      {/* Form tìm kiếm */}
      <div className="flex justify-between mb-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Bạn cần tìm gì?"
            className="pl-10 pr-4 py-2 border rounded-lg w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        {/* Nút Xóa */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={handleDeleteSelected}
          disabled={selectedCustomers.length === 0}
        >
          <Trash size={16} className="inline mr-2" /> Xóa
        </button>
      </div>

      {/* Bảng danh sách khách hàng */}
      <div className="bg-white rounded-lg shadow overflow-x-auto relative">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4"><input type="checkbox" /></th>
              <th className="p-4 text-left">Tên Khách Hàng</th>
              <th className="p-4 text-left">Liên Hệ</th>
              <th className="p-4 text-left">Tổng Đơn Hàng</th>
              <th className="p-4 text-left">Tổng Chi Tiêu</th>
              <th className="p-4 text-left">Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      onChange={() => handleSelectCustomer(customer._id)}
                    />
                  </td>
                  <td className="p-4 flex items-center">
                    {/* Avatar được thay thế bằng ký tự đầu tiên của tên */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="ml-3">
                        <div className="font-medium">{customer.name || "Không có tên"}</div>
                        <div className="text-gray-500 text-sm">{customer.lastActivity || "Chưa có hoạt động"}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center mb-1">
                      <Mail size={16} className="mr-2 text-gray-500" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">{customer.totalOrders}</td>
                  <td className="p-4">{customer.totalSpent}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        customer.status === "Trực Tuyến"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">Không có khách hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-1">
          {/* Nút quay về trang trước */}
          <button
            className="px-3 py-1 border rounded-md"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>

          {/* Hiển thị số trang */}
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              className={`px-3 py-1 border rounded-md ${
                currentPage === page + 1 ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </button>
          ))}

          {/* Nút chuyển sang trang tiếp theo */}
          <button
            className="px-3 py-1 border rounded-md"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}