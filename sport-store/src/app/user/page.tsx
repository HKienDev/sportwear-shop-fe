"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SafeIcons } from "@/utils/safeIcons";
import ProductCard from "@/components/user/products/productCard/page";
import { useAuth } from "@/context/authContext";
import { Product } from "@/types/product";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import { Category } from "@/types/category";
import Skeleton from "@/components/common/Skeleton";

// Thêm khai báo cho window.__checkedAuth
declare global {
  interface Window {
    __checkedAuth?: boolean;
  }
}

const HomePage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, checkAuthStatus } = useAuth();

  useEffect(() => {
    if (user === null && typeof window !== 'undefined' && !(window as Window & { __checkedAuth?: boolean }).__checkedAuth) {
      (window as Window & { __checkedAuth?: boolean }).__checkedAuth = true;
      checkAuthStatus();
    }
  }, [user, checkAuthStatus]);

  useEffect(() => {
    console.log('👤 User page - User state:', {
      hasUser: !!user,
      userRole: user?.role,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
    
    if (
      user &&
      user.role === "admin" &&
      typeof window !== "undefined" &&
      window.location.pathname === "/user"
    ) {
      console.log('🔄 User page - Admin user detected, redirecting to admin dashboard');
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    // Fetch products và categories song song
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        if (!productRes.success) throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
        if (!categoryRes.success) throw new Error("Lỗi khi lấy dữ liệu thể loại");
        setProducts(productRes.data.products);
        setCategories(categoryRes.data.categories || []);
      } catch {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Skeleton Ronaldo */}
          <div className="col-span-12 rounded-2xl overflow-hidden group shadow-lg h-[400px]">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        </div>
      </div>
      {/* Skeleton sản phẩm */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Cải thiện */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Ảnh Ronaldo + nội dung - Cải thiện */}
          <div className="col-span-12 relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-500">
            {/* Background Image with Zoom Effect */}
            <div className="relative w-full h-[400px] min-h-[400px] transform transition-transform duration-700 group-hover:scale-105">
              <Image
                src="/Ronaldo.png"
                alt="Ronaldo promotion"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center brightness-[1.02]"
                priority
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-br-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-l from-purple-500/20 to-red-500/20 rounded-tl-full blur-2xl"></div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
              {/* Sale Badge */}
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full w-fit mb-4
                shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5">
                KHUYẾN MÃI ĐẶC BIỆT
              </span>

              {/* Main Title */}
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                Giảm Giá Lên Đến
                <span className="text-[#1CFB8C] align-middle">&nbsp;</span>
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">50%</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 blur-xl"></span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-white/90 font-medium max-w-md mb-6 leading-relaxed">
                Đăng ký thành viên để nhận ưu đãi đặc biệt từ{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  VJU SPORT
                </span>{' '}
                và cập nhật sản phẩm mới nhất.
              </p>

              {/* CTA Button */}
              <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                text-white px-6 py-3 rounded-lg font-bold w-fit flex items-center shadow-lg hover:shadow-purple-500/25 
                transition-all duration-300 hover:-translate-y-0.5">
                <span className="relative z-10">Tham Gia Ngay</span>
                <SafeIcons.ArrowRight size={18} className="ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 
                  transition-transform duration-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-[200%]"></div>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Danh sách sản phẩm chia theo thể loại */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Sản phẩm Mới</h1>
        {categories && categories.length > 0 ? (
          categories.map((category) => {
            const productsInCategory = products.filter(
              (product) => product.categoryId === category._id || product.categoryId === category.categoryId
            );
            if (!productsInCategory.length) return null;
            return (
              <div key={category._id} className="mb-12">
                <div className="flex items-center mb-4">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover mr-3 border"
                    />
                  )}
                  <h2 className="text-2xl font-semibold text-gray-800">{category.name}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsInCategory.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Không có thể loại nào</p>
        )}
      </div>

      {/* Testimonials Section - Mới */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        {/* Background với gradient và pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white to-red-100/30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex flex-col items-center">
              <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-red-500 rounded-full mb-6"></div>
              <span className="text-purple-600 font-semibold tracking-wider mb-2">KHÁCH HÀNG NÓI GÌ</span>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                ĐÁNH GIÁ TỪ KHÁCH HÀNG
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-40 h-40 bg-gradient-to-r from-purple-200/30 to-transparent rounded-full opacity-60 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-l from-red-200/30 to-transparent rounded-full opacity-60 blur-2xl"></div>

            {/* Testimonial Cards */}
            {/* Card 1 */}
            <div className="group bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-purple-100 hover:border-purple-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-2 ring-purple-200 group-hover:ring-purple-400">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Liu-bang.jpg"
                    alt="Hán Cao Tổ"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Hán Cao Tổ - Lưu Bang</h4>
                  <p className="text-sm text-gray-500">Nhà Hán</p>
                </div>
                {/* Quote Icon */}
                <div className="absolute top-0 right-0 text-gray-200 transform -translate-y-1/2 group-hover:text-purple-300 transition-colors duration-300">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 relative z-10 group-hover:text-gray-800 transition-colors duration-300">
                &ldquo;Giàu sang không thể làm hư hỏng, nghèo khó không thể lay chuyển, uy vũ không thể khuất phục, đó mới là bậc đại trượng phu!&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex text-yellow-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500 italic">206 TCN - 195 TCN</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-gradient-to-br from-white to-red-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-red-100 hover:border-red-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-2 ring-red-200 group-hover:ring-red-400">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Song_Taizu.jpg/1200px-Song_Taizu.jpg"
                    alt="Tống Thái Tổ"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">Tống Thái Tổ - Triệu Khuông Dận</h4>
                  <p className="text-sm text-gray-500">Nhà Tống</p>
                </div>
                <div className="absolute top-0 right-0 text-gray-200 transform -translate-y-1/2 group-hover:text-red-300 transition-colors duration-300">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 relative z-10 group-hover:text-gray-800 transition-colors duration-300">
                &ldquo;Thiên hạ đích tâm, thiên hạ đích huyết!&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex text-yellow-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500 italic">927 - 976</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-pink-100 hover:border-pink-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-2 ring-pink-200 group-hover:ring-pink-400">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/%E6%98%8E%E5%A4%AA%E7%A5%96%E7%94%BB%E5%83%8F.jpg/250px-%E6%98%8E%E5%A4%AA%E7%A5%96%E7%94%BB%E5%83%8F.jpg"
                    alt="Minh Thái Tổ"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">Minh Thái Tổ - Chu Nguyên Chương</h4>
                  <p className="text-sm text-gray-500">Nhà Minh</p>
                </div>
                <div className="absolute top-0 right-0 text-gray-200 transform -translate-y-1/2 group-hover:text-pink-300 transition-colors duration-300">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 relative z-10 group-hover:text-gray-800 transition-colors duration-300">
                &ldquo;Hoàng đế cai trị thiên hạ, không thể phụ lòng thiên hạ!&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex text-yellow-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500 italic">1328 - 1398</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
    </div>
  );
};

export default HomePage; 