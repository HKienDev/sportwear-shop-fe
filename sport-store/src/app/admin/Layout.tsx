"use client";
import Sidebar from "@/components/AdminLayout/Sidebar";
import Topbar from "@/components/AdminLayout/Topbar";
import Footer from "@/components/AdminLayout/Footer";
import { CartProvider } from "@/app/context/CartContext"; // Import CartProvider

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider> {/* Bọc toàn bộ layout với CartProvider */}
      <div className="flex min-h-screen bg-[#F6F6F6]">
        {/* Sidebar */}
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <Topbar />
          {/* Nội dung chính */}
          <main className="flex-1 p-6 mt-14 ml-64">{children}</main>
          <Footer />
        </div>
      </div>
    </CartProvider>
  );
}