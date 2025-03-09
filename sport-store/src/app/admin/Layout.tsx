import Link from "next/link";
import { usePathname } from "next/navigation"; // Để kiểm tra đường dẫn hiện tại

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-100 min-h-screen p-4">
        <nav className="space-y-2">
          <Link href="/admin">
            <div className={`p-3 rounded-md ${pathname === "/admin" ? "bg-[#4EB09D] text-white" : "text-[#858594]"}`}>
              Trang chủ
            </div>
          </Link>
          <Link href="/admin/orders">
            <div className={`p-3 rounded-md ${pathname.startsWith("/admin/orders") ? "bg-[#4EB09D] text-white" : "text-[#858594]"}`}>
              Quản lý đơn hàng
            </div>
          </Link>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}