"use client";

import Image from "next/image";

const Footer = () => (
  <footer className="bg-[#333333] text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-1 flex flex-col items-center">
          <div className="relative w-32 h-20"> {/* Chỉnh width-height */}
            <Image 
              src="/Logo_vju.png" 
              alt="VJU SPORT" 
              layout="fill" 
              objectFit="contain" 
              priority 
            />
          </div>
          <h3 className="text-xl font-bold text-center mt-2">VJU SPORT</h3>
        </div>

        {/* Các phần còn lại giữ nguyên */}
      </div>

      {/* Copyright */}
      <div className="text-center pt-8 mt-8 border-t border-gray-700">
        <p>© 2025 Vju Sport | All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
