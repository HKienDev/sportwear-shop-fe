'use client';

import { Providers } from "../app/providers";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import SessionTimeoutWarning from "./SessionTimeoutWarning";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Component wrapper để tránh hydration mismatch
function ToasterWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Toaster
      position="top-right"
      duration={4000}
      richColors
    />
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Providers>
      {children}
      <ToasterWrapper />
      <SessionTimeoutWarning />
    </Providers>
  );
} 