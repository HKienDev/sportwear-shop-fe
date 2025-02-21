import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/app/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sport Store - Mua sắm đồ thể thao",
  description: "Cửa hàng bán đồ thể thao chính hãng, chất lượng.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
