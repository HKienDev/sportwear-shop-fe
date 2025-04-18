"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProductDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/user/products");
  }, [router]);

  return null;
}