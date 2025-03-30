"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
    {/* Main Footer */}
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="relative w-20 h-20">
            <Image 
              src="/Logo_vju.png" 
              alt="VJU SPORT" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-2xl font-bold text-white">VJU SPORT</h3>
          <p className="text-sm text-gray-400 text-center md:text-left">
            Cung cấp các sản phẩm thể thao chất lượng cao với giá cả hợp lý
          </p>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Dịch Vụ Khách Hàng</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/faq" className="hover:text-white transition-colors duration-200">
                Câu Hỏi Thường Gặp
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Chính Sách Bảo Mật
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Điều Khoản & Điều Kiện
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-white transition-colors duration-200">
                Hỗ Trợ
              </Link>
            </li>
          </ul>
        </div>

        {/* Collaboration */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Hợp Tác</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/partnership" className="hover:text-white transition-colors duration-200">
                Hợp Tác Với Chúng Tôi
              </Link>
            </li>
            <li>
              <Link href="/opportunities" className="hover:text-white transition-colors duration-200">
                Cơ Hội Ký Hợp Tác
              </Link>
            </li>
            <li>
              <Link href="/partner-login" className="hover:text-white transition-colors duration-200">
                Đăng Nhập Đối Tác
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Liên Hệ</h4>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <FaEnvelope className="text-gray-400" />
              <a href="mailto:support@vjusport.com" className="hover:text-white transition-colors duration-200">
                support@vjusport.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FaPhone className="text-gray-400" />
              <a href="tel:+84362592258" className="hover:text-white transition-colors duration-200">
                +84 362 592 258
              </a>
            </li>
            <li className="flex items-start space-x-2">
              <FaMapMarkerAlt className="text-gray-400 mt-1" />
              <span className="hover:text-white transition-colors duration-200">
                Phố Lưu Hữu Phước, Phường Cầu Diễn, Quận Nam Từ Liêm, Hà Nội
              </span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Kết Nối Với Chúng Tôi</h4>
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} VJU SPORT. All Rights Reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <Link href="/sitemap" className="hover:text-white transition-colors duration-200">
              Sitemap
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors duration-200">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
