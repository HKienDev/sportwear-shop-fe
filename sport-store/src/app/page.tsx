"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/authContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } else {
      router.replace("/auth/login");
    }
  }, [user, router]);

  return null;
} 