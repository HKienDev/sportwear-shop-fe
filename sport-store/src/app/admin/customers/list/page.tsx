"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  lastActivity: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
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
      // Lấy token chính xác như trong code gốc
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        console.error("Không tìm thấy Access Token");
        alert("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }
  
      const url = new URL("http://localhost:4000/api/users");
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("limit", "10");
      if (searchQuery.trim()) url.searchParams.append("query", searchQuery.trim());
  
      // Gọi API với thông tin xác thực
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include" // Thêm cookies nếu có
      });
  
      if (response.status === 403) {
        console.error("Lỗi 403: Không có quyền truy cập");
        alert("Bạn không có quyền truy cập vào tài nguyên này. Vui lòng đăng nhập lại hoặc liên hệ quản trị viên.");
        router.push("/login");
        return;
      }
      
      if (response.status === 401) {
        console.error("Lỗi 401: Phiên đăng nhập hết hạn");
        alert("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Dữ liệu từ API:", data);
  
      // Xử lý nếu API trả về dữ liệu sai định dạng
      const customersArray = Array.isArray(data.customers) ? data.customers : [];
      setCustomers(customersArray);
      setTotalPages(typeof data.totalPages === "number" ? data.totalPages : 1);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi lấy danh sách khách hàng:", error.message);
      } else {
        console.error("Lỗi không xác định khi gọi API");
      }
    }
  }, [currentPage, searchQuery, router]);
  
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
          "Authorization": `Bearer ${token}`
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
        <h1 className="text-2xl font-bold mb-4">DANH SÁCH KHÁCH HÀNG</h1>
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => router.push("/add-customer")}>+ Thêm Khách Hàng</button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
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
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" onChange={() => handleSelectCustomer(customer.id)} /></td>
                  <td className="p-4 flex items-center">
                    <Image src="/your-image.jpg" alt="Description" width={500} height={300} />
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-gray-500 text-sm">{customer.lastActivity}</div>
                    </div>
                  </td>
                  <td className="p-4">{customer.email} / {customer.phone}</td>
                  <td className="p-4">{customer.totalOrders}</td>
                  <td className="p-4">{customer.totalSpent}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${customer.status === "Trực Tuyến" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{customer.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={handleDeleteSelected} disabled={selectedCustomers.length === 0}>Xóa đã chọn</button>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded-md" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>&lt;</button>
            {[...Array(totalPages).keys()].map((page) => (
              <button key={page + 1} className={`px-3 py-1 border rounded-md ${currentPage === page + 1 ? "bg-blue-500 text-white" : ""}`} onClick={() => setCurrentPage(page + 1)}>{page + 1}</button>
            ))}
            <button className="px-3 py-1 border rounded-md" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>&gt;</button>
          </div>
        </div>
      </div>
  );
}