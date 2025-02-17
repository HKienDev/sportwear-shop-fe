"use client";

import Image from "next/image";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page"; 
import ProductList, { ProductCard } from "@/components/ProductList/page";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 h-[400px] rounded-lg overflow-hidden">
            <Image src="/messi.png" alt="Messi celebration" width={700} height={400} className="w-full h-full object-cover" />
          </div>
          <div className="col-span-9 relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/Ronaldo.png" alt="Ronaldo promotion" width={900} height={400} className="w-full h-full object-cover object-center brightness-110" />
            <div className="absolute inset-0 bg-opacity-10 flex flex-col justify-center px-8">
              <h1 className="text-white text-4xl font-bold mb-2">
                Giảm Giá Lên Đến <span style={{ color: "#FF4D4D" }}>50%</span>
              </h1>
              <p className="text-white font-semibold">Đăng ký thành viên để nhận ưu đãi đặc biệt từ VJU SPORT.</p>
              <button className="bg-purple-600 text-white px-6 py-2 font-bold rounded-lg w-fit mt-4">Tham Gia Ngay</button>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Sale Section */}
      <div className="container mx-auto px-4 my-6">
        <div className="bg-[#4FAF98] p-6 rounded-2xl shadow-lg">
          <h2 className="text-white text-3xl font-bold mb-2 ">HOT SALE CUỐI TUẦN</h2>
          <p className="text-lg font-bold text-center mb-6">
            <span style={{ color: "#FEEAAA" }}>Kết thúc sau: 12:59:59:99</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <ProductCard 
                key={item} 
                id={item}
                name={`Sản phẩm ${item}`} 
                subtitle={`Sản phẩm ${item}`} 
                price="1.200.000VNĐ" 
                salePrice="1.000.000VNĐ" 
                image="/shoes.png" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="container mx-auto px-4 mt-6">
        <div className="relative rounded-lg overflow-hidden h-48">
          <Image 
            src="/messi.png" 
            alt="Information Banner"
            width={1200} height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-8">
            <h2 className="text-white text-2xl font-bold mb-2">BẠN CÓ BIẾT?</h2>
            <p className="text-white">
              Hơn <span className="text-red-500">10.000</span> khách hàng đã tham gia và mỗi ngày có đến{' '}
              <span className="text-red-500">200</span> đơn hàng được thực hiện thông qua VJU SPORT.
            </p>
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
            <Image src="/Logo_vju.png" alt="Partner 1" width={200} height={100} className="object-contain mx-auto" />
            <Image src="/Logo_deha.png" alt="Partner 2" width={200} height={100} className="object-contain mx-auto" />
            <Image src="/Logo_vnu.png" alt="Partner 3" width={200} height={100} className="object-contain mx-auto" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;