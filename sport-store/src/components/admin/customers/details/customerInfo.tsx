import Image from "next/image";
import { Input } from "./input";
import { Select } from "./select";

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
          <p className="text-indigo-600 font-medium">ID: #VJUSPORTUSER-{customer.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">THÔNG TIN KHÁCH HÀNG</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
  );
} 