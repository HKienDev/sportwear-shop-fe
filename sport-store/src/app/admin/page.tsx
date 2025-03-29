"use client";
import React, { useEffect, useState } from "react";
import { FaShippingFast } from "react-icons/fa";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

// Tạo instance axios với baseURL
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          console.log("No access token found");
          router.replace('/user/auth/login');
          return;
        }

        console.log("Checking auth with token:", accessToken);
        const response = await api.get("/auth/check", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        console.log("Auth check response:", response.data);

        if (!response.data.user || response.data.user.role !== "admin") {
          console.log("User is not admin");
          router.replace('/user/auth/login');
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        } else {
          toast.error("Vui lòng đăng nhập để tiếp tục");
        }
        router.replace('/user/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Dữ liệu thống kê
  const statistics = [
    { title: "Tổng đơn hàng", value: "1.2K", percent: "11.2%", up: true, icon: "🛒", color: "#4F46E5" },
    { title: "Đơn đang giao", value: "534", percent: "5.2%", up: false, icon: "🚚", color: "#FACC15" },
    { title: "Doanh thu hôm nay", value: "300.2M VND", percent: "8.5%", up: true, icon: "💰", color: "#22C55E" },
    { title: "Khách hàng mới", value: "134", percent: "7.1%", up: true, icon: "👥", color: "#3B82F6" },
  ];

  // Dữ liệu biểu đồ
  const data = {
    labels: ["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01"],
    datasets: [
      {
        data: [60, 70, 20, 90.1, 60, 40, 70],
        backgroundColor: ["#D1D5DB", "#D1D5DB", "#D1D5DB", "#EF4444", "#D1D5DB", "#D1D5DB", "#111827"],
        borderRadius: 15,
        borderSkipped: false,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn legend "Doanh thu"
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            weight: 600,
          },
        },
        grid: {
          drawBorder: false,
          display: false, // Tắt gạch dọc
        },
      },
      y: {
        ticks: {
          font: {
            weight: 600,
          },
          callback: (value: unknown) => `${value}M`,
        },
        grid: {
          drawBorder: false,
          color: "#ECECEC", // Giữ gạch ngang
        },
      },
    },
  };

  // Dữ liệu sản phẩm bán chạy
  const bestSellers = [
    { name: "Adidas Predator Freak FG", id: "#0987", sales: "1.3k", image: "/shoes.png" },
    { name: "Adidas Predator Freak FG", id: "#0987", sales: "1.3k", image: "/shoes.png" },
    { name: "Adidas Predator Freak FG", id: "#0987", sales: "1.3k", image: "/shoes.png" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trang Quản Trị</h1>
      <div className="p-6 space-y-6">
        {/* Thống kê */}
        <div className="grid grid-cols-4 gap-4">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                <span className={`ml-2 text-sm flex items-center ${stat.up ? "text-green-500" : "text-red-500"}`}>
                  {stat.up ? <AiOutlineRise /> : <AiOutlineFall />}
                  {stat.percent}
                </span>
              </div>
              <span className="text-gray-500 text-sm font-medium mt-1">So với tháng trước</span>
            </div>
          ))}
        </div>

        {/* Tổng doanh thu + Biểu đồ */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row items-center md:items-start h-[400px]"> 
          {/* Bên trái: Thông tin doanh thu */}
          <div className="flex-1 space-y-4">
            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-lg bg-black text-white font-medium">Ngày</button>
              <button className="px-4 py-2 rounded-lg bg-gray-100 font-medium">Tháng</button>
              <button className="px-4 py-2 rounded-lg bg-gray-100 font-medium">Năm</button>
            </div>
            <h3 className="text-2xl font-bold">Tổng Doanh Thu</h3>
            <p className="text-3xl font-bold text-[#FF4D4D]">300.215.000 <span className="text-black text-xl">VND</span></p>
            <h3 className="text-2xl font-bold mt-2">Trung Bình</h3>
            <p className="text-2xl font-bold text-[#4EB09D]">58.045.000 <span className="text-black text-xl">VND</span></p>
          </div>

          {/* Bên phải: Biểu đồ */}
          <div className="flex-1 h-[350px]">
            <Bar data={data} options={options} />
          </div>
        </div>

        {/* Đơn hàng đang giao + Sản phẩm bán chạy */}
        <div className="grid grid-cols-2 gap-6">
          {/* Đơn hàng đang giao */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold flex items-center">
              <FaShippingFast className="mr-2 text-blue-500" /> Đơn đang được giao
            </h3>
            <div className="space-y-4 mt-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-700 font-semibold">Mã vận chuyển</h4>
                    <span className="text-gray-500 font-bold text-lg">#01234</span>
                    <p className="text-gray-500 text-sm">1 Lưu Hữu Phước → 2 Phú Điền</p>
                  </div>
                  <Image src="/ship.png" width={120} height={100} alt="truck" />
                </div>
              ))}
            </div>
          </div>

          {/* Sản phẩm bán chạy */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Sản phẩm bán chạy</h3>
              <span className="text-blue-500 cursor-pointer">Xem tất cả</span>
            </div>
            <div className="space-y-4 mt-4">
              {bestSellers.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <Image src={item.image} width={50} height={50} alt="product" />
                  <div className="flex-1">
                    <h4 className="text-gray-700 font-semibold">{item.name}</h4>
                    <p className="text-gray-500 text-sm">Mã hàng: {item.id}</p>
                  </div>
                  <span className="text-red-500 font-bold">{item.sales} lượt bán</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}