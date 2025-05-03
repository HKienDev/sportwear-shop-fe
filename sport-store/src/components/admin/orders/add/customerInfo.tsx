"use client";

import { useEffect, useState } from "react";
import { useCustomer, Location } from "@/context/customerContext";
import Input from "./input";
import Select from "./select";
import { User, MapPin, UserCircle, ChevronRight } from "lucide-react";

// Interfaces for API responses
interface ProvinceResponse {
  code: number;
  name: string;
}

interface DistrictResponse {
  code: number;
  name: string;
  districts?: DistrictResponse[];
}

interface WardResponse {
  code: number;
  name: string;
  wards?: WardResponse[];
}

export default function CustomerInfo() {
  const { customer, updateCustomer } = useCustomer();

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  
  useEffect(() => {
    console.log("Current customer state:", customer);
  }, [customer]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=1");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        const formattedProvinces = Array.isArray(data) ? data.map((p: ProvinceResponse) => ({
          code: p.code.toString(),
          name: p.name
        })) : [];
        
        setProvinces(formattedProvinces);
      } catch (err) {
        console.error("Lỗi lấy tỉnh/thành phố:", err);
        setProvinces([]);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!customer.province) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const provinceCode = customer.province?.code;
        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        let districtsData: Location[] = [];
        if (data && Array.isArray(data.districts)) {
          districtsData = data.districts.map((d: DistrictResponse) => ({
            code: d.code.toString(),
            name: d.name
          }));
        }
        
        setDistricts(districtsData);
      } catch (err) {
        console.error("Lỗi lấy quận/huyện:", err);
        setDistricts([]);
      }
    };

    fetchDistricts();
  }, [customer.province]);

  useEffect(() => {
    if (!customer.district) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        const districtCode = customer.district?.code;
        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        let wardsData: Location[] = [];
        if (data && Array.isArray(data.wards)) {
          wardsData = data.wards.map((w: WardResponse) => ({
            code: w.code.toString(),
            name: w.name
          }));
        }
        
        setWards(wardsData);
      } catch (err) {
        console.error("Lỗi lấy phường/xã:", err);
        setWards([]);
      }
    };

    fetchWards();
  }, [customer.district]);

  const handleProvinceChange = (code: string) => {
    const province = provinces.find(p => p.code === code) || null;
    updateCustomer("province", province);
  };

  const handleDistrictChange = (code: string) => {
    const district = districts.find(d => d.code === code) || null;
    updateCustomer("district", district);
  };

  const handleWardChange = (code: string) => {
    const ward = wards.find(w => w.code === code) || null;
    updateCustomer("ward", ward);
  };

  // Address summary display
  const getAddressSummary = () => {
    const parts = [];
    if (customer.street) parts.push(customer.street);
    if (customer.ward?.name) parts.push(customer.ward.name);
    if (customer.district?.name) parts.push(customer.district.name);
    if (customer.province?.name) parts.push(customer.province.name);
    
    return parts.join(", ") || "Chưa có địa chỉ";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header with stylish gradient */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 p-6 text-white">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 p-3 rounded-xl shadow-lg">
            <UserCircle size={28} />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">THÔNG TIN KHÁCH HÀNG</h2>
            <p className="text-sm opacity-90 mt-1">Vui lòng nhập đầy đủ thông tin giao hàng</p>
          </div>
        </div>
      </div>

      {/* Main form section */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Personal information card */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <User size={18} className="text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Thông tin cá nhân</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Input
                  label="TÊN NGƯỜI NHẬN" 
                  value={customer.fullName} 
                  onChange={(val) => updateCustomer("fullName", val)} 
                  placeholder="Nhập tên người nhận"
                  width="w-full"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Input 
                  label="SĐT NGƯỜI NHẬN" 
                  value={customer.phone} 
                  onChange={(val) => updateCustomer("phone", val)} 
                  placeholder="Nhập số điện thoại"
                  width="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Address information card */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center mb-4">
              <MapPin size={18} className="text-orange-500" />
              <h3 className="text-gray-700 font-medium ml-2">Địa chỉ giao hàng</h3>
            </div>
            
            {/* Address summary */}
            <div className="mb-5 p-3 bg-orange-50 rounded-lg border border-orange-100 text-sm text-gray-700 flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin size={16} className="text-orange-500" />
                </div>
              </div>
              <div className="flex-1">
                {getAddressSummary()}
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Select
                  label="TỈNH / THÀNH PHỐ"
                  options={provinces.map((p) => ({ value: p.code, label: p.name }))}
                  value={customer.province ? customer.province.code : ""}
                  onChange={handleProvinceChange}
                  placeholder="Chọn Tỉnh/Thành phố"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Select
                  label="QUẬN / HUYỆN"
                  options={districts.map((d) => ({ value: d.code, label: d.name }))}
                  value={customer.district ? customer.district.code : ""}
                  onChange={handleDistrictChange}
                  disabled={!customer.province}
                  placeholder="Chọn Quận/Huyện"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Select
                  label="PHƯỜNG / XÃ"
                  options={wards.map((w) => ({ value: w.code, label: w.name }))}
                  value={customer.ward ? customer.ward.code : ""}
                  onChange={handleWardChange}
                  disabled={!customer.district}
                  placeholder="Chọn Phường/Xã"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                <Input 
                  label="SỐ NHÀ, TÊN ĐƯỜNG" 
                  value={customer.street} 
                  onChange={(val) => updateCustomer("street", val)}
                  placeholder="Nhập số nhà, tên đường"
                  width="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}