import Image from "next/image";
import { Input } from "./input";
import { Select } from "./select";
import { useState } from "react";

interface Location {
  code: string;
  name: string;
}

interface CustomerData {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  province?: Location;
  district?: Location;
  ward?: Location;
  address: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
}

type CustomerUpdateField = 
  | "fullname" 
  | "phone" 
  | "avatar" 
  | "address" 
  | "isActive";

type CustomerUpdateValue = 
  | string 
  | boolean 
  | { province: string; district: string; ward: string; street: string };

interface CustomerInfoProps {
  customer: CustomerData;
  provinces: Location[];
  districts: Location[];
  wards: Location[];
  onUpdateCustomer: (field: CustomerUpdateField, value: CustomerUpdateValue) => Promise<void>;
  onProvinceChange: (value: string) => Promise<void>;
  onDistrictChange: (value: string) => Promise<void>;
  onWardChange: (value: string) => Promise<void>;
}

export default function CustomerInfo({
  customer,
  provinces,
  districts,
  wards,
  onUpdateCustomer,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
}: CustomerInfoProps) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 lg:w-2/3 w-full border border-neutral-100">
      <div className="flex items-center gap-5 mb-6">
        <div className="relative w-20 h-20 overflow-hidden rounded-full border-2 border-indigo-100">
          <Image
            src={customer.avatar || "/avatarDefault.jpg"}
            width={80}
            height={80}
            className="object-cover"
            alt="Avatar"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-800">{customer.name || "Chưa cập nhật tên"}</h2>
          <p className="text-indigo-600 font-medium">ID: #{customer.id}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">THÔNG TIN KHÁCH HÀNG</h2>
        <button
          onClick={() => setIsEditingAddress(!isEditingAddress)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {isEditingAddress ? "Hủy chỉnh sửa" : "Chỉnh sửa địa chỉ"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <Input
          label="TÊN NGƯỜI NHẬN"
          value={customer.name}
          onChange={(val) => onUpdateCustomer("fullname", val)}
          placeholder="Nhập tên người nhận"
        />

        <Input
          label="SĐT NGƯỜI NHẬN"
          value={customer.phone}
          onChange={(val) => onUpdateCustomer("phone", val)}
          placeholder="Nhập số điện thoại"
        />

        {isEditingAddress ? (
          <>
            <Select
              label="TỈNH / THÀNH PHỐ"
              options={provinces.map((p) => ({ value: p.code, label: p.name }))}
              value={customer.province?.code || ""}
              onChange={onProvinceChange}
              placeholder="Chọn Tỉnh/Thành phố"
            />

            <Select
              label="QUẬN / HUYỆN"
              options={districts.map((d) => ({ value: d.code, label: d.name }))}
              value={customer.district?.code || ""}
              onChange={onDistrictChange}
              disabled={!customer.province}
              placeholder="Chọn Quận/Huyện"
            />

            <Select
              label="PHƯỜNG / XÃ"
              options={wards.map((w) => ({ value: w.code, label: w.name }))}
              value={customer.ward?.code || ""}
              onChange={onWardChange}
              disabled={!customer.district}
              placeholder="Chọn Phường/Xã"
            />

            <Input
              label="SỐ NHÀ, TÊN ĐƯỜNG"
              value={customer.address.street}
              onChange={(val) => onUpdateCustomer("address", { 
                province: customer.province?.code || customer.address.province, 
                district: customer.district?.code || customer.address.district, 
                ward: customer.ward?.code || customer.address.ward, 
                street: val 
              })}
              placeholder="Nhập số nhà, tên đường"
            />
          </>
        ) : (
          <>
            <div className="col-span-2">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-500">ĐỊA CHỈ HIỆN TẠI</span>
                  <span className="text-neutral-800">
                    {[
                      customer.address.street,
                      customer.address.ward,
                      customer.address.district,
                      customer.address.province
                    ].filter(Boolean).join(", ") || "Chưa cập nhật địa chỉ"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 