"use client";

import Image from "next/image";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => (
  <footer className={`bg-white border-t border-gray-200 ${className}`} style={{ minHeight: 120 }}>
    <div className="container mx-auto px-4 py-8">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Company Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/Logo_vju.png"
              alt="VJU Logo"
              width={48}
              height={48}
              className="rounded-lg"
              priority
              style={{ width: 48, height: 48 }}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
              VJU SPORT
            </span>
          </div>
          <p className="text-gray-600">
            Địa chỉ: Phố Lưu Hữu Phước, Cầu Diễn, Nam Từ Liêm, Hà Nội
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/vjusport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="https://www.instagram.com/vjusport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="https://twitter.com/vjusport" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-4">Liên hệ</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-600">
              <Phone size={20} className="mr-2" />
              <span>+84 362 195 258</span>
            </li>
            <li className="flex items-center text-gray-600">
              <Mail size={20} className="mr-2" />
              <span>info@vjusport.com</span>
            </li>
            <li className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2" />
              <span>Nam Từ Liêm, Hà Nội</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wider mb-4">Đăng ký nhận tin</h3>
          <p className="text-gray-600 mb-4">
            Đăng ký để nhận những thông tin mới nhất về sản phẩm và khuyến mãi
          </p>
          <form className="flex space-x-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg hover:from-purple-700 hover:to-red-700 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">
            © 2024 VJU SPORT. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
