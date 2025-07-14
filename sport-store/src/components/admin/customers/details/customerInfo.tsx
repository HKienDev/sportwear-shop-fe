import Image from "next/image";
import { Input } from "./input";
import { Select } from "./select";
import { Camera, CheckCircle, User, Phone, MapPin, Edit3, AlertCircle, Shield } from "lucide-react";

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

  // Validation functions
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const isPhoneValid = customer.phone ? validatePhone(customer.phone) : true;
  const isNameValid = customer.name ? validateName(customer.name) : true;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-2xl border-4 border-white shadow-lg transition-all duration-300 group-hover:border-indigo-100 group-hover:shadow-xl">
              <Image
                src={customer.avatar || "/avatarDefault.jpg"}
                width={96}
                height={96}
                className="object-cover w-full h-full"
                alt="Avatar khách hàng"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-xl shadow-lg cursor-pointer opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <Camera size={16} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {customer.name || "Chưa cập nhật tên"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200">
                  <CheckCircle size={12} />
                  Đã xác thực
                </span>
                <span className="text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-200">
                  <Shield size={12} />
                  Hoạt động
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <User size={14} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium">ID: #{customer.id.slice(0, 8).toUpperCase()}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Edit3 size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Thông tin khách hàng</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              label="Tên người nhận"
              value={customer.name}
              onChange={(val) => onDataChange("fullname", val)}
              placeholder="Nhập tên người nhận"
              error={!isNameValid && customer.name ? "Tên phải có ít nhất 2 ký tự" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Số điện thoại"
              value={customer.phone || "Khách hàng chưa cập nhật"}
              onChange={() => {}}
              placeholder="Nhập số điện thoại"
              disabled
              error={!isPhoneValid && customer.phone ? "Số điện thoại không hợp lệ" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Tỉnh / Thành phố"
              options={provinces.map((p) => ({ value: p.code, label: p.name }))}
              value={customer.province?.code || ""}
              onChange={onProvinceChange}
              placeholder="Chọn Tỉnh/Thành phố"
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Quận / Huyện"
              options={districts.map((d) => ({ value: d.code, label: d.name }))}
              value={customer.district?.code || ""}
              onChange={onDistrictChange}
              disabled={!customer.province}
              placeholder="Chọn Quận/Huyện"
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Phường / Xã"
              options={wards.map((w) => ({ value: w.code, label: w.name }))}
              value={customer.ward?.code || ""}
              onChange={onWardChange}
              disabled={!customer.district}
              placeholder="Chọn Phường/Xã"
            />
          </div>

          <div className="space-y-2">
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
        </div>

        {/* Address Summary */}
        {customer.address.street && (
          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-2 text-sm">Địa chỉ hiện tại</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {customer.address.street}, {customer.address.ward}, {customer.address.district}, {customer.address.province}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        {(!isNameValid || !isPhoneValid) && (
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle size={14} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1 text-sm">Cần cập nhật thông tin</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  {!isNameValid && <li>• Tên khách hàng chưa hợp lệ</li>}
                  {!isPhoneValid && <li>• Số điện thoại chưa hợp lệ</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}