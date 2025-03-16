"use client";

import Image from "next/image";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page"; 
import ProductList from "@/components/productList/page";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-12 gap-4 items-stretch">
          {/* Ảnh Messi */}
          <div className="col-span-3 rounded-lg overflow-hidden flex">
            <Image
              src="/messi.png"
              alt="Messi celebration"
              width={700}
              height={400}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Ảnh Ronaldo + nội dung */}
          <div className="col-span-9 relative rounded-lg overflow-hidden flex">
            <Image
              src="/Ronaldo.png"
              alt="Ronaldo promotion"
              width={900}
              height={400}
              className="w-full h-full object-cover object-center brightness-110 rounded-lg"
            />
            {/* Overlay nội dung */}
            <div className="absolute inset-0 bg-opacity-10 flex flex-col justify-center px-8">
              <h1 className="text-white text-4xl font-bold mb-2">
                Giảm Giá Lên Đến <span style={{ color: "#FF4D4D" }}>50%</span>
              </h1>
              <p className="text-white font-semibold">
                Đăng ký thành viên để nhận ưu đãi đặc biệt từ VJU SPORT.
              </p>
              <button className="bg-purple-600 text-white px-6 py-2 font-bold rounded-lg w-fit mt-4">
                Tham Gia Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductList />

      {/* About Section */}
      <div className="w-screen bg-gray-100">
        <div className="w-full flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 h-[600px]">
            <Image 
              src="/Ronaldo.png"
              alt="Ronaldo"
              width={800} height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-16">
            <h2 className="text-4xl font-bold text-gray-800">Về chúng tôi</h2>
            <div className="space-y-6 text-lg font-medium text-gray-700 mt-6">
              <p>Chào mừng đến với <span className="text-red-500">VJU SPORT</span></p>
              <p>Tại <span className="text-red-500">VJU SPORT</span>, chúng tôi đang thay đổi cách mua sắm đồ thể thao...</p>
              
              <h3 className="text-2xl font-bold text-gray-800 mt-8">Sứ Mệnh Của Chúng Tôi</h3>
              <p>Chúng tôi cam kết mang lại chất lượng và trải nghiệm mua sắm tốt nhất cho khách hàng.</p>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-24 pb-24 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">ĐỐI TÁC CỦA CHÚNG TÔI</h2>
          <div className="grid grid-cols-3 gap-8 items-center justify-items-center">
          <Image
            src="/Logo_vju.png"
            alt="Logo VJU"
            width={200}
            height={100}
            style={{ width: "auto", height: "auto" }} 
          />
          <Image
            src="/Logo_deha.png"
            alt="Logo DEHA"
            width={200}
            height={100}
            style={{ width: "auto", height: "auto" }} 
          />
          <Image
            src="/Logo_vnu.png"
            alt="Logo VNU"
            width={200}
            height={100}
            style={{ width: "auto", height: "auto" }} 
          />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;