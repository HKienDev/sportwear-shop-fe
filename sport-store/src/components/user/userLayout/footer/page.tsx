"use client";

import Image from "next/image";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => (
  <footer className={`bg-white border-t border-gray-200 ${className}`} style={{ minHeight: 'auto' }}>
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
      {/* Main Footer Content - Enhanced Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Company Info - Enhanced Responsive */}
        <div className="space-y-3 sm:space-y-4 min-h-[160px] sm:min-h-[180px]">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/vju-logo-main.png"
              alt="VJU Logo"
              width={40}
              height={40}
              className="rounded-lg w-10 h-10 sm:w-12 sm:h-12"
              priority
            />
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent font-sans">
              VJU SPORT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
            Địa chỉ: Phố Lưu Hữu Phước, Cầu Diễn, Nam Từ Liêm, Hà Nội
          </p>
          <div className="flex space-x-3 sm:space-x-4">
            <a 
              href="https://www.facebook.com/vjusport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors p-1 sm:p-1.5 rounded-lg hover:bg-blue-50"
              aria-label="Facebook"
            >
              <Facebook size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a 
              href="https://www.instagram.com/vjusport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors p-1 sm:p-1.5 rounded-lg hover:bg-pink-50"
              aria-label="Instagram"
            >
              <Instagram size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a 
              href="https://twitter.com/vjusport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-colors p-1 sm:p-1.5 rounded-lg hover:bg-blue-50"
              aria-label="Twitter"
            >
              <Twitter size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links - Enhanced Responsive */}
        <div className="min-h-[160px] sm:min-h-[180px] font-sans">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Liên kết nhanh</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors block py-1 hover:translate-x-1 transform duration-200">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors block py-1 hover:translate-x-1 transform duration-200">
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors block py-1 hover:translate-x-1 transform duration-200">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-colors block py-1 hover:translate-x-1 transform duration-200">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info - Enhanced Responsive */}
        <div className="min-h-[160px] sm:min-h-[180px] font-sans">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Liên hệ</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            <li className="flex items-center text-gray-600">
              <Phone size={16} className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm">+84 362 195 258</span>
            </li>
            <li className="flex items-center text-gray-600">
              <Mail size={16} className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm break-all">notify.vjusport@gmail.com</span>
            </li>
            <li className="flex items-start text-gray-600">
              <MapPin size={16} className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Nam Từ Liêm, Hà Nội</span>
            </li>
          </ul>
        </div>

        {/* Newsletter - Enhanced Responsive */}
        <div className="min-h-[160px] sm:min-h-[180px] font-sans">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 uppercase tracking-wider mb-3 sm:mb-4">Đăng ký nhận tin</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">
            Đăng ký để nhận những thông tin mới nhất về sản phẩm và khuyến mãi
          </p>
          <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:from-purple-700 hover:to-red-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar - Enhanced Responsive */}
      <div className="pt-4 sm:pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            © 2025 VJU SPORT. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition-colors text-center sm:text-left">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition-colors text-center sm:text-left">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
