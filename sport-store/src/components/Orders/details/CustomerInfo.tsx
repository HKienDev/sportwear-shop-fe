"use client";

import { useState, useEffect } from "react";
import Input from "@/components/Orders/Input";
import Select from "@/components/Orders/Select";

const API_BASE = "https://provinces.open-api.vn/api";

interface Location {
  code: string;
  name: string;
}

const CustomerInfo = () => {
  const [customer, setCustomer] = useState({
    name: "Hoàng Tiến Trung Kiên",
    phone: "0378809999",
    provinceCode: "",
    districtCode: "",
    wardCode: "",
    address: "01, Lê Đức Thọ",
  });

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/p`)
      .then((res) => res.json())
      .then(setProvinces)
      .catch((error) => console.error("Lỗi khi lấy tỉnh/thành phố:", error));
  }, []);

  useEffect(() => {
    if (!customer.provinceCode) return;
    fetch(`${API_BASE}/p/${customer.provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []))
      .catch((error) => console.error("Lỗi khi lấy quận/huyện:", error));
  }, [customer.provinceCode]);

  useEffect(() => {
    if (!customer.districtCode) return;
    fetch(`${API_BASE}/d/${customer.districtCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch((error) => console.error("Lỗi khi lấy phường/xã:", error));
  }, [customer.districtCode]);

  const updateCustomer = (field: keyof typeof customer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
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
          value={customer.provinceCode}
          onChange={(val) => updateCustomer("provinceCode", val)}
          placeholder="Chọn Tỉnh/Thành phố"
        />

        <Select
          label="QUẬN / HUYỆN"
          options={districts.map((d) => ({ value: d.code, label: d.name }))}
          value={customer.districtCode}
          onChange={(val) => updateCustomer("districtCode", val)}
          disabled={!customer.provinceCode}
          placeholder="Chọn Quận/Huyện"
        />

        <Select
          label="PHƯỜNG / XÃ"
          options={wards.map((w) => ({ value: w.code, label: w.name }))}
          value={customer.wardCode}
          onChange={(val) => updateCustomer("wardCode", val)}
          disabled={!customer.districtCode}
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
};

export default CustomerInfo;