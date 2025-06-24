'use client';

import { Providers } from "../app/providers";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Providers>
      {children}
    </Providers>
  );
} 