import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { CustomerProvider } from "@/context/customerContext";
import { PaymentMethodProvider } from "@/context/paymentMethodContext";
import { ShippingMethodProvider } from "@/context/shippingMethodContext";
import { PromoProvider } from "@/context/promoContext";
import { Toaster } from "@/components/ui/toast";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat"
});

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
      <body className={`${montserrat.variable} font-sans min-h-screen bg-background antialiased`}>
        <AuthProvider>
          <CartProvider>
            <CustomerProvider>
              <PaymentMethodProvider>
                <ShippingMethodProvider>
                  <PromoProvider>
                    {children}
                    <Toaster />
                  </PromoProvider>
                </ShippingMethodProvider>
              </PaymentMethodProvider>
            </CustomerProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}