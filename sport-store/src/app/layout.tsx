import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Khánh Hoàn Shop - Quần Áo Nam Thời Trang, Năng Động & Lịch Lãm",
  description: "Shop quần áo nam Khánh Hoàn: áo thun, sơ mi, quần jeans, đồ thể thao. Thời trang nam trẻ trung, phong cách, giá tốt, giao hàng toàn quốc.",
  keywords: "quần áo nam, thời trang nam, áo thun nam, sơ mi nam, quần jeans nam, đồ thể thao nam",
  authors: [{ name: "Khánh Hoàn Shop" }],
  creator: "Khánh Hoàn Shop",
  publisher: "Khánh Hoàn Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Khánh Hoàn Shop - Quần Áo Nam Thời Trang",
    description: "Shop quần áo nam Khánh Hoàn: áo thun, sơ mi, quần jeans, đồ thể thao. Thời trang nam trẻ trung, phong cách, giá tốt.",
    url: '/',
    siteName: 'Khánh Hoàn Shop',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Khánh Hoàn Shop - Quần Áo Nam Thời Trang",
    description: "Shop quần áo nam Khánh Hoàn: áo thun, sơ mi, quần jeans, đồ thể thao. Thời trang nam trẻ trung, phong cách, giá tốt.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/vju-logo-main.png',
    apple: '/vju-logo-main.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/vju-logo-main.png" type="image/png" />
        <link rel="apple-touch-icon" href="/vju-logo-main.png" />
        <link rel="apple-touch-icon-precomposed" href="/vju-logo-main.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Khánh Hoàn Shop" />
        <meta name="application-name" content="Khánh Hoàn Shop" />
        <meta name="mobile-web-app-capable" content="yes" />
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