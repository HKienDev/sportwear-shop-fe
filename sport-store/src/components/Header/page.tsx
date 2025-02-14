"use client";

import Link from "next/link";
import { Search, ShoppingCart, Phone, MapPin } from "lucide-react";
import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

type Product = {
  id: number;
  title: string;
  price: number;
  salePrice?: number;
  category: string;
};

const Header = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/Products');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }      
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handler = debounce((value) => {
      setDebouncedSearch(value);
    }, 300);
    
    handler(searchTerm);
    return () => handler.cancel();
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    return products.filter((product) =>
      product?.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      product?.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, products]);

  return (
    <header className="bg-white py-4 px-6 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-black">
            VJU SPORT
          </Link>
          <button className="bg-red-500 text-white text-lg font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md">
            Danh mục
          </button>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Bạn cần tìm gì?"
              className="pl-12 pr-4 py-3 border rounded-full w-full text-lg bg-gray-100 text-gray-600 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
            {filteredProducts.length > 0 && (
              <ul className="absolute w-full bg-white border rounded-lg mt-2 shadow-lg">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                    {product.title} - {product.salePrice || product.price} VND
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center gap-10">
          <ContactInfo icon={Phone} text="Gọi mua hàng" subtext="1800.0244" />
          <ContactInfo icon={MapPin} text="Cửa hàng" subtext="Gần bạn" />
          <ShoppingCartButton />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

const ContactInfo = ({ icon: Icon, text, subtext }: { icon: React.ElementType, text: string, subtext: string }) => (
  <div className="flex items-center gap-3 text-lg">
    <Icon className="w-6 h-6 text-black" />
    <div>
      <div className="font-semibold text-black">{text}</div>
      <div className="text-gray-500 text-sm">{subtext}</div>
    </div>
  </div>
);

const ShoppingCartButton = () => (
  <div className="relative flex items-center gap-3 text-lg font-semibold text-black">
    <ShoppingCart className="w-6 h-6" />
    <div>Giỏ hàng</div>
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2">1</span>
  </div>
);

const AuthButtons = () => (
  <div className="flex gap-4">
    <button className="text-lg px-5 py-2 w-30 border rounded-xl hover:bg-gray-100 font-semibold">Đăng Nhập</button>
    <button className="text-lg px-5 py-2 w-30 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold shadow-md">
      Đăng Ký
    </button>
  </div>
);

export default Header;
