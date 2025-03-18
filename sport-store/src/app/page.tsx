"use client";

import Image from "next/image";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page"; 
import ProductList from "@/components/productList/page";
import { ArrowRight, ShoppingBag, Users, Award } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner - Cải thiện */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Ảnh Messi - Cải thiện */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 rounded-xl overflow-hidden flex relative group shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <Image
              src="/messi.png"
              alt="Messi celebration"
              width={700}
              height={400}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity opacity-90 group-hover:opacity-100 flex flex-col justify-end p-6">
              <span className="text-sm font-semibold text-yellow-400 mb-1">HÀNG MỚI</span>
              <h2 className="text-white text-xl font-bold mb-2">Bộ sưu tập giới hạn</h2>
              <div className="flex items-center text-white text-sm font-medium hover:underline cursor-pointer">
                Khám phá ngay
                <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Ảnh Ronaldo + nội dung - Cải thiện */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 relative rounded-xl overflow-hidden flex shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <Image
              src="/Ronaldo.png"
              alt="Ronaldo promotion"
              width={900}
              height={400}
              className="w-full h-full object-cover object-center brightness-[1.02] rounded-xl"
            />
            {/* Overlay nội dung */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-center px-8 md:px-12">
              <span className="text-white text-sm font-semibold bg-red-600 px-3 py-1 rounded-full w-fit mb-4">
                KHUYẾN MÃI ĐẶC BIỆT
              </span>
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                Giảm Giá Lên Đến <span className="text-red-500">50%</span>
              </h1>
              <p className="text-white/90 font-medium max-w-md mb-6">
                Đăng ký thành viên để nhận ưu đãi đặc biệt từ VJU SPORT và cập nhật sản phẩm mới nhất.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 font-bold rounded-lg w-fit flex items-center transition-all duration-300 transform hover:translate-x-1">
                Tham Gia Ngay
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm section mới - Ưu điểm */}
      <div className="container mx-auto px-4 mt-14 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <ShoppingBag size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Miễn phí vận chuyển</h3>
            <p className="text-gray-600">Miễn phí giao hàng cho tất cả đơn hàng trên 500.000đ trong nội thành</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Đội ngũ hỗ trợ khách hàng chuyên nghiệp luôn sẵn sàng giúp đỡ bạn</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Award size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sản phẩm chính hãng</h3>
            <p className="text-gray-600">Cam kết 100% sản phẩm chính hãng với chất lượng tốt nhất</p>
          </div>
        </div>
      </div>

      <ProductList />

      {/* About Section - Cải thiện */}
      <div className="w-full bg-gray-50">
        <div className="w-full flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 h-[600px] relative group overflow-hidden">
            <Image 
              src="/Ronaldo.png"
              alt="Ronaldo"
              width={800} height={600}
              className="w-full h-full object-cover transition duration-700 ease-in-out group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-16">
            <div className="w-16 h-1 bg-red-500 mb-6"></div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Về chúng tôi</h2>
            <p className="text-gray-500 text-lg mb-8">Nơi đam mê thể thao được thể hiện</p>
            
            <div className="space-y-6 text-lg font-medium text-gray-700">
              <p>Chào mừng đến với <span className="text-red-500 font-bold">VJU SPORT</span></p>
              <p>Tại <span className="text-red-500 font-bold">VJU SPORT</span>, chúng tôi đang thay đổi cách mua sắm đồ thể thao với sự kết hợp hoàn hảo giữa phong cách, chất lượng và hiệu suất.</p>
              
              <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Sứ Mệnh Của Chúng Tôi</h3>
              <p>Chúng tôi cam kết mang lại chất lượng và trải nghiệm mua sắm tốt nhất cho khách hàng, đồng thời truyền cảm hứng cho lối sống năng động và lành mạnh.</p>
            </div>
            
            <button className="mt-10 bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center w-fit">
              Tìm hiểu thêm
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Partners Section - Cải thiện */}
        <div className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-semibold">ĐỒNG HÀNH CÙNG CHÚNG TÔI</span>
            <h2 className="text-3xl font-bold mt-2">ĐỐI TÁC CỦA CHÚNG TÔI</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-40 w-full">
              <Image
                src="/Logo_vju.png"
                alt="Logo VJU"
                width={200}
                height={100}
                style={{ width: "auto", height: "auto", maxHeight: "80px" }} 
                className="transition-all duration-300 hover:scale-105"
              />
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-40 w-full">
              <Image
                src="/Logo_deha.png"
                alt="Logo DEHA"
                width={200}
                height={100}
                style={{ width: "auto", height: "auto", maxHeight: "80px" }} 
                className="transition-all duration-300 hover:scale-105"
              />
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center h-40 w-full">
              <Image
                src="/Logo_vnu.png"
                alt="Logo VNU"
                width={200}
                height={100}
                style={{ width: "auto", height: "auto", maxHeight: "80px" }} 
                className="transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;