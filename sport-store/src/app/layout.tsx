import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Sport Store",
  description: "Cửa hàng thể thao trực tuyến",
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
      <body className="font-montserrat min-h-screen bg-background antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}