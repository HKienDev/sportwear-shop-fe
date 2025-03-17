"use client";

import { useEffect, useState } from "react";
import { useCustomer, Location } from "@/app/context/customerContext0";
import Input from "./input";
import Select from "./select";

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
  
  // Debug logs để theo dõi giá trị customer
  useEffect(() => {
    console.log("Current customer state:", customer);
  }, [customer]);

  // Tải danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=1");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Chuẩn hóa dữ liệu province
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

  // Tải danh sách quận/huyện khi tỉnh thay đổi
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
        
        // Chuẩn hóa dữ liệu district
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

  // Tải danh sách phường/xã khi quận thay đổi
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
        
        // Chuẩn hóa dữ liệu ward
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

  // Handlers cho thay đổi giá trị
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">THÔNG TIN KHÁCH HÀNG</h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Input
          label="TÊN NGƯỜI NHẬN" 
          value={customer.name} 
          onChange={(val) => updateCustomer("name", val)} 
          placeholder="Nhập tên người nhận" 
        />
        
        <Input 
          label="SĐT NGƯỜI NHẬN" 
          value={customer.phone} 
          onChange={(val) => updateCustomer("phone", val)} 
          placeholder="Nhập số điện thoại" 
        />

        <Select
          label="TỈNH / THÀNH PHỐ"
          options={provinces.map((p) => ({ value: p.code, label: p.name }))}
          value={customer.province ? customer.province.code : ""}
          onChange={handleProvinceChange}
          placeholder="Chọn Tỉnh/Thành phố"
        />

        <Select
          label="QUẬN / HUYỆN"
          options={districts.map((d) => ({ value: d.code, label: d.name }))}
          value={customer.district ? customer.district.code : ""}
          onChange={handleDistrictChange}
          disabled={!customer.province}
          placeholder="Chọn Quận/Huyện"
        />

        <Select
          label="PHƯỜNG / XÃ"
          options={wards.map((w) => ({ value: w.code, label: w.name }))}
          value={customer.ward ? customer.ward.code : ""}
          onChange={handleWardChange}
          disabled={!customer.district}
          placeholder="Chọn Phường/Xã"
        />

        <Input 
          label="SỐ NHÀ, TÊN ĐƯỜNG" 
          value={customer.address} 
          onChange={(val) => updateCustomer("address", val)}
          placeholder="Nhập số nhà, tên đường" 
        />
      </div>
    </div>
  );
}