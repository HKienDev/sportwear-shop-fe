import Image from "next/image";
import { Input } from "./input";
import { Select } from "./select";
import { Camera, CheckCircle, User, Phone, MapPin, Edit3 } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-4 py-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-2xl border-4 border-white shadow-lg transition-all duration-300 group-hover:border-indigo-100">
              <Image
                src={customer.avatar || "/avatarDefault.jpg"}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                alt="Avatar khách hàng"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-1.5 rounded-lg shadow-lg cursor-pointer opacity-90 hover:opacity-100 transition-all duration-300">
              <Camera size={14} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                {customer.name || "Chưa cập nhật tên"}
              </h2>
              <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium border border-emerald-200">
                <CheckCircle size={12} />
                Đã xác thực
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <User size={12} className="text-indigo-600" />
                </div>
                <span className="text-xs font-medium">ID: #{customer.id.slice(0, 8).toUpperCase()}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-5 h-5 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone size={12} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-medium">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-indigo-600" />
            <h3 className="text-base font-semibold text-slate-800">Thông tin khách hàng</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên người nhận"
            value={customer.name}
            onChange={(val) => onDataChange("fullname", val)}
            placeholder="Nhập tên người nhận"
          />

          <Input
            label="Số điện thoại"
            value={customer.phone || "Khách hàng chưa cập nhật"}
            onChange={() => {}}
            placeholder="Nhập số điện thoại"
            disabled
          />

          <Select
            label="Tỉnh / Thành phố"
            options={provinces.map((p) => ({ value: p.code, label: p.name }))}
            value={customer.province?.code || ""}
            onChange={onProvinceChange}
            placeholder="Chọn Tỉnh/Thành phố"
          />

          <Select
            label="Quận / Huyện"
            options={districts.map((d) => ({ value: d.code, label: d.name }))}
            value={customer.district?.code || ""}
            onChange={onDistrictChange}
            disabled={!customer.province}
            placeholder="Chọn Quận/Huyện"
          />

          <Select
            label="Phường / Xã"
            options={wards.map((w) => ({ value: w.code, label: w.name }))}
            value={customer.ward?.code || ""}
            onChange={onWardChange}
            disabled={!customer.district}
            placeholder="Chọn Phường/Xã"
          />

          <Input
            label="Số nhà, tên đường"
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

        {/* Address Summary */}
        {customer.address.street && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-1 text-sm">Địa chỉ hiện tại</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {customer.address.street}, {customer.address.ward}, {customer.address.district}, {customer.address.province}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}