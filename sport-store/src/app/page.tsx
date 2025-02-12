"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Phone, MapPin } from "lucide-react";

type ProductProps = {
  title: string;
  price: string;
  salePrice: string;
};

const Header = () => (
  <header className="bg-white py-3 px-4 border-b">
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold">VJU SPORT</Link>
        <button className="bg-red-500 text-white text-sm px-3 py-1.5 rounded">
          Danh mục
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Bạn tìm gì?"
            className="pl-8 pr-4 py-1.5 border rounded w-64 text-sm"
          />
          <Search className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ContactInfo icon={Phone} text="Gọi mua hàng" subtext="1900.6345" />
        <ContactInfo icon={MapPin} text="Cửa hàng" subtext="gần bạn" />
        <ShoppingCartButton />
        <AuthButtons />
      </div>
    </div>
  </header>
);

const ContactInfo = ({ icon: Icon, text, subtext }: { icon: any; text: string; subtext: string }) => (
  <div className="flex items-center gap-1 text-sm">
    <Icon className="w-4 h-4" />
    <div>
      <div>{text}</div>
      <div>{subtext}</div>
    </div>
  </div>
);

const ShoppingCartButton = () => (
  <div className="flex items-center gap-1 text-sm">
    <ShoppingCart className="w-4 h-4" />
    <div>
      <div>Giỏ hàng</div>
    </div>
  </div>
);

const AuthButtons = () => (
  <>
    <button className="text-sm px-4 py-1.5 border rounded hover:bg-gray-50">
      Đăng Nhập
    </button>
    <button className="text-sm px-4 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600">
      Đăng Ký
    </button>
  </>
);

const HeroBanner = () => (
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
          <p className="text-white">Đăng ký thành viên để nhận ưu đãi đặc biệt từ VJU SPORT.</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg w-fit mt-4">Tham Gia Ngay</button>
        </div>
      </div>
    </div>
  </div>
);

const ProductCard = ({ title, price, salePrice }: ProductProps) => (
  <div className="bg-white p-4 rounded-lg">
    <div className="relative">
      <Image src="/shoes.png" alt={title} width={400} height={150} className="object-cover" />
    </div>
    <div className="mt-3">
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="flex justify-between items-center mt-2">
        <div>
          <div className="text-gray-500 line-through text-sm">{price}</div>
          <div className="text-red-500 font-medium">{salePrice}</div>
        </div>
        <button className="text-red-500 text-sm">Yêu thích ♡</button>
      </div>
    </div>
  </div>
);

const HotSaleSection = () => (
  <div className="container mx-auto px-4 my-6">
    <div className="bg-[#4FAF98] p-6 rounded-2xl shadow-lg">
      <h2 className="text-white text-3xl font-bold mb-2 ">HOT SALE CUỐI TUẦN</h2>
      <p className="text-lg font-semibold text-center mb-6">
        <span style={{ color: "#FEEAAA" }}>Kết thúc sau: 12:59:59:99</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <ProductCard 
            key={item} 
            title={`Sản phẩm ${item}`} 
            price="1.200.000VNĐ" 
            salePrice="1.000.000VNĐ" 
          />
        ))}
      </div>
    </div>
  </div>
);

const InfoBanner = () => (
  <div className="container mx-auto px-4 mt-6">
    <div className="relative rounded-lg overflow-hidden h-48">
      <img
        src="/messi.png" 
        alt="Information Banner"
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
);

const ProductGrid = () => {
  const products = Array(12).fill({
    name: "Adidas F50 Elite Laceless FG - Advancement Pack",
    originalPrice: "1.000.000VNĐ",
    salePrice: "5.000.000VNĐ",
    subtitle: "Giày đá bóng sân cỏ tự nhiên"
  });

  return (
    <div className="container mx-auto px-4 mt-6">
      {[1, 2, 3].map((section, idx) => (
        <div key={idx} className="mb-8">
          <h2 className="text-xl font-medium mb-4">Giày Cỏ Tự Nhiên</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.slice((idx * 4), (idx * 4) + 4).map((product, productIdx) => (
              <div key={productIdx} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="relative">
                  <img
                    src="/shoes.png" 
                    alt={product.name}
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">{product.subtitle}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <div className="text-gray-500 line-through text-sm">
                        {product.originalPrice}
                      </div>
                      <div className="text-red-500 font-medium">
                        {product.salePrice}
                      </div>
                    </div>
                    <button className="flex items-center text-red-500 text-sm hover:text-red-600">
                      Yêu thích <span className="ml-1">♡</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AboutSection = () => (
  <div className="container mx-auto px-4 mt-12 mb-16">
    <div className="grid grid-cols-2 gap-8">
      {/* Left side - Image */}
      <div className="relative h-[400px]">
        <img
          src="/Ronaldo.png" 
          alt="Ronaldo"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Right side - Content */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Về chúng tôi</h2>
        <div className="space-y-4">
          <p>Chào mừng đến với <span className="text-red-500">VJU SPORT</span></p>
          <p>Tại <span className="text-red-500">VJU SPORT</span>, chúng tôi đang thay đổi cách mua sắm đồ thể thao. Sứ mệnh của chúng tôi là mang đến trải nghiệm mua sắm tiện mạch và thú vị cho mọi vận động viên. Dù bạn cần trang phục, dụng cụ hay phụ kiện cho bóng đá, tennis, bóng rổ, bóng chuyền hay bất kỳ môn thể thao nào, <span className="text-red-500">VJU SPORT</span> luôn sẵn sàng mang sản phẩm chất lượng đến bạn.</p>
          
          <h3 className="text-xl font-bold mt-6">Sứ Mệnh Của Chúng Tôi</h3>
          <p>Chúng tôi cam kết mang lại chất lượng và trải nghiệm mua sắm tốt nhất cho khách hàng.</p>
          <p>Với các sản phẩm hàng đầu và nhiều ưu đãi hợp dẫn thông qua phương án đảm bảo bạn sẽ tìm thấy món thú mình cần để nâng cao trải nghiệm tập luyện và thi đấu.</p>
        </div>
      </div>
    </div>

    {/* Partners Section */}
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-center">ĐỐI TÁC CỦA CHÚNG TÔI</h2>
      <div className="grid grid-cols-4 gap-8 items-center justify-items-center">
        <img src="/path-to-partner1.png" alt="Partner 1" className="h-20 object-contain" />
        <img src="/path-to-partner2.png" alt="Partner 2" className="h-20 object-contain" />
        <img src="/path-to-partner3.png" alt="Partner 3" className="h-20 object-contain" />
        <img src="/path-to-partner4.png" alt="Partner 4" className="h-20 object-contain" />
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-5 gap-8">
        {/* Logo and Brand */}
        <div className="col-span-1">
          <div className="mb-4">
            <img src="/path-to-logo.png" alt="VJU SPORT" className="h-16" />
          </div>
          <h3 className="text-xl font-bold">VJU SPORT</h3>
        </div>

        {/* Customer Service */}
        <div className="col-span-1">
          <h4 className="font-bold mb-4">Dịch Vụ Khách Hàng</h4>
          <ul className="space-y-2">
            <li>Câu Hỏi Thường Gặp</li>
            <li>Chính Sách Bảo Mật</li>
            <li>Điều Khoản & Điều Kiện</li>
            <li>Hỗ Trợ</li>
          </ul>
        </div>

        {/* Collaboration */}
        <div className="col-span-1">
          <h4 className="font-bold mb-4">Hợp Tác</h4>
          <ul className="space-y-2">
            <li>Hợp Tác Với Chúng Tôi</li>
            <li>Cơ Hội Ký Hợp Tác</li>
            <li>Đăng Nhập Đối Tác</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="font-bold mb-4">Liên Hệ</h4>
          <ul className="space-y-2">
            <li>Email: support@vjusport.com</li>
            <li>Điện thoại: +84 362 592 258</li>
            <li>Địa chỉ: Đường Láng Mai Dịch, Phường Cầu Diễn, Quận Nam Từ Liêm, Hà Nội</li>
          </ul>
        </div>

        {/* Learn More */}
        <div className="col-span-1">
          <h4 className="font-bold mb-4">Tìm Hiểu Thêm</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.374 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.626-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pt-8 mt-8 border-t border-gray-700">
        <p>© 2025 Vju Sport | All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

// Update your HomePage component:
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <HeroBanner />
      <HotSaleSection />
      <InfoBanner />
      <ProductGrid />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default HomePage;
