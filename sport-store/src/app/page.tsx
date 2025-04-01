"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { handleRedirect } from "@/utils/navigationUtils";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);
  const lastCheckTime = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (!loading && !hasRedirected.current && (now - lastCheckTime.current) > 2000) {
      lastCheckTime.current = now;
      hasRedirected.current = true;
      console.log('🔄 Home page redirect check:', { user, loading });
      handleRedirect(router, user, window.location.pathname);
    }
  }, [user, loading, router]);

  return null;
} 