import Image from "next/image";
import { Input } from "./input";
import { Select } from "./select";
import { Camera, CheckCircle } from "lucide-react";

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
  onProvinceChange: (value: string) => Promise<void>;
  onDistrictChange: (value: string) => Promise<void>;
  onWardChange: (value: string) => Promise<void>;
  onDataChange: (field: CustomerUpdateField, value: CustomerUpdateValue) => void;
}

export default function CustomerInfo({
  customer,
  provinces,
  districts,
  wards,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onDataChange,
}: CustomerInfoProps) {

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 lg:w-2/3 w-full border border-neutral-100 transition-all duration-300 hover:border-indigo-100 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 relative">
        <div className="relative group">
          <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-indigo-50 shadow-md transition-all duration-300 group-hover:border-indigo-100">
            <Image
              src={customer.avatar || "/avatarDefault.jpg"}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              alt="Avatar khách hàng"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg cursor-pointer opacity-90 hover:opacity-100 transition-all duration-300">
            <Camera size={16} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">
              {customer.name || "Chưa cập nhật tên"}
            </h2>
            <span className="text-emerald-500 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle size={14} />
              Đã xác thực
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2">
            <p className="text-indigo-600 font-medium flex items-center">
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded mr-2 text-xs">ID</span>
              #{customer.id.slice(0, 8).toUpperCase()}
            </p>
            {customer.phone && (
              <p className="text-neutral-600 flex items-center">
                <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded mr-2 text-xs">SĐT</span>
                {customer.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-6">
          <div className="w-1 h-6 bg-indigo-600 rounded"></div>
          <h2 className="text-lg font-semibold text-neutral-800">THÔNG TIN KHÁCH HÀNG</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="TÊN NGƯỜI NHẬN"
            value={customer.name}
            onChange={(val) => onDataChange("fullname", val)}
            placeholder="Nhập tên người nhận"
          />

          <Input
            label="SĐT NGƯỜI NHẬN"
            value={customer.phone || "Khách hàng chưa cập nhật"}
            onChange={() => {}}
            placeholder="Nhập số điện thoại"
            disabled
          />

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
            onChange={(val) => onDataChange("address", { 
              province: customer.address.province, 
              district: customer.address.district, 
              ward: customer.address.ward, 
              street: val 
            })}
            placeholder="Nhập số nhà, tên đường"
          />
        </div>
      </div>
    </div>
  );
}