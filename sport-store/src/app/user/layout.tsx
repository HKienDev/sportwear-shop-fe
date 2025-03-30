import { Montserrat } from "next/font/google";
import Header from "@/components/user/userLayout/header/page";
import Footer from "@/components/user/userLayout/footer/page";
import "../globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen flex flex-col ${montserrat.variable} overflow-x-hidden`}>
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer className="mt-auto" />
    </div>
  );
} 