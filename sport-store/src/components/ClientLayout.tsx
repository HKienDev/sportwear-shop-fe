'use client';

import { Providers } from "../app/providers";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import SessionTimeoutWarning from "./SessionTimeoutWarning";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import ErrorBoundaryWrapper from "./ErrorBoundary";

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
    <Toaster />
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Initialize error handler
  useErrorHandler();

  return (
    <ErrorBoundaryWrapper>
      <Providers>
        {children}
        <ToasterWrapper />
        <SessionTimeoutWarning />
      </Providers>
    </ErrorBoundaryWrapper>
  );
} 