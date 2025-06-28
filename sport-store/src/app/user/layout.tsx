"use client";

import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import Header from "@/components/user/userLayout/header/page";
import Footer from "@/components/user/userLayout/footer/page";
import UserChat from "@/components/common/chat/userChat";
import { AuthProvider } from "../../context/authContext";
import { CartProvider } from "../../context/cartContext";
import "../globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

function UserLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Kiểm tra xem có đang ở messages page không
  const isMessagesPage = pathname === '/user/messages';

  return (
    <div className={`min-h-screen flex flex-col ${montserrat.variable} overflow-x-hidden`}>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer className="mt-auto" />
      {/* User Chat Component */}
      <UserChat />
    </div>
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <UserLayoutContent>{children}</UserLayoutContent>
      </CartProvider>
    </AuthProvider>
  );
} 