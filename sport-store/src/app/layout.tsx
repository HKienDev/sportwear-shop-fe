import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Khánh Hoàn Shop - Quần Áo Nam Thời Trang, Năng Động & Lịch Lãm",
  description: "Shop quần áo nam Khánh Hoàn: áo thun, sơ mi, quần jeans, đồ thể thao. Thời trang nam trẻ trung, phong cách, giá tốt, giao hàng toàn quốc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/vju-logo-main.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}