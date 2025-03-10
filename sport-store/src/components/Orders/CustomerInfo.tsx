"use client";

import { useEffect, useState } from "react";
import { useCustomer, Location } from "@/app/context/CustomerContext";
import Input from "./Input";
import Select from "./Select";

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
        console.log("Provinces data fetched successfully:", data.length);
        
        // Chuẩn hóa dữ liệu province để đảm bảo đúng cấu trúc Location
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

  // Tải danh sách quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    // Reset districts khi không có province
    if (!customer.province) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const provinceCode = customer.province?.code;
        console.log("Fetching districts for province code:", provinceCode);
        
        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Kiểm tra cấu trúc dữ liệu trả về
        console.log("Raw districts data:", data);
        
        // Đảm bảo districts là một mảng và chuẩn hóa dữ liệu
        let districtsData: Location[] = [];
        if (data && Array.isArray(data.districts)) {
          districtsData = data.districts.map((d: DistrictResponse) => ({
            code: d.code.toString(),
            name: d.name
          }));
        }
        
        console.log("Formatted districts data:", districtsData);
        setDistricts(districtsData);
        
        // Nếu không cần phải giữ district và ward khi province thay đổi, reset chúng
        updateCustomer("district", null);
        updateCustomer("ward", null);
      } catch (err) {
        console.error("Lỗi lấy quận/huyện:", err);
        setDistricts([]);
        updateCustomer("district", null);
        updateCustomer("ward", null);
      }
    };

    fetchDistricts();
  }, [customer.province, updateCustomer]);

  // Tải danh sách phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    // Reset wards khi không có district
    if (!customer.district) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        const districtCode = customer.district?.code;
        console.log("Fetching wards for district code:", districtCode);
        
        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        // Kiểm tra cấu trúc dữ liệu trả về
        console.log("Raw wards data:", data);
        
        // Đảm bảo wards là một mảng và chuẩn hóa dữ liệu
        let wardsData: Location[] = [];
        if (data && Array.isArray(data.wards)) {
          wardsData = data.wards.map((w: WardResponse) => ({
            code: w.code.toString(),
            name: w.name
          }));
        }
        
        console.log("Formatted wards data:", wardsData);
        setWards(wardsData);
        
        // Nếu không cần phải giữ ward khi district thay đổi, reset nó
        updateCustomer("ward", null);
      } catch (err) {
        console.error("Lỗi lấy phường/xã:", err);
        setWards([]);
        updateCustomer("ward", null);
      }
    };

    fetchWards();
  }, [customer.district, updateCustomer]);

  // Handlers cho việc thay đổi giá trị
  const handleProvinceChange = (code: string) => {
    console.log("Province changed to code:", code);
    const province = provinces.find(p => p.code === code) || null;
    console.log("Found province:", province);
    updateCustomer("province", province);
  };

  const handleDistrictChange = (code: string) => {
    console.log("District changed to code:", code);
    const district = districts.find(d => d.code === code) || null;
    console.log("Found district:", district);
    updateCustomer("district", district);
  };

  const handleWardChange = (code: string) => {
    console.log("Ward changed to code:", code);
    const ward = wards.find(w => w.code === code) || null;
    console.log("Found ward:", ward);
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