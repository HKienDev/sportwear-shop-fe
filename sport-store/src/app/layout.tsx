import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
import SchemaMarkup from "@/components/common/SchemaMarkup";

export const metadata: Metadata = {
  title: "VJU Sport - Cửa Hàng Thể Thao Chất Lượng Cao",
  description: "VJU Sport - Cửa hàng thể thao chuyên cung cấp các sản phẩm thể thao chất lượng cao, giày thể thao, quần áo thể thao, phụ kiện thể thao. Giao hàng toàn quốc, giá tốt nhất.",
  keywords: "thể thao, giày thể thao, quần áo thể thao, phụ kiện thể thao, VJU Sport, cửa hàng thể thao",
  authors: [{ name: "VJU Sport" }],
  creator: "VJU Sport",
  publisher: "VJU Sport",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vjusport.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "VJU Sport - Cửa Hàng Thể Thao Chất Lượng Cao",
    description: "VJU Sport - Cửa hàng thể thao chuyên cung cấp các sản phẩm thể thao chất lượng cao, giày thể thao, quần áo thể thao, phụ kiện thể thao.",
    url: '/',
    siteName: 'VJU Sport',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/Logo_vju.png',
        width: 1200,
        height: 630,
        alt: 'VJU Sport Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "VJU Sport - Cửa Hàng Thể Thao Chất Lượng Cao",
    description: "VJU Sport - Cửa hàng thể thao chuyên cung cấp các sản phẩm thể thao chất lượng cao.",
    images: ['/Logo_vju.png'],
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
    icon: '/Logo_vju.png',
    apple: '/Logo_vju.png',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <SchemaMarkup type="Organization" data={{}} />
        <SchemaMarkup type="WebSite" data={{}} />
      </body>
    </html>
  );
}