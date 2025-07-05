"use client";

import { useCart } from "@/context/cartContext";

export default function DebugCartPage() {
  const { items, totalItems, totalPrice } = useCart();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Cart</h1>
      
      <div className="grid gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Cart State</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ items, totalItems, totalPrice }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 