"use client";

import { useEffect, useState } from "react";
import { useCustomer, Location } from "@/context/customerContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Phone, Home, Info } from "lucide-react";

export default function CustomerInfo() {
  const { customer, updateCustomer } = useCustomer();

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  
  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoadingProvinces(true);
        
        // Sử dụng API backend
        try {
          const res = await fetch("/api/orders/address/provinces", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (res.ok) {
            const responseData = await res.json();
            if (responseData.success) {
              setProvinces(responseData.data);
              return;
            }
          }
        } catch (apiError) {
          console.warn("API backend không khả dụng, sử dụng dữ liệu tĩnh:", apiError);
        }

        // Fallback: Sử dụng dữ liệu tĩnh
        const staticProvinces: Location[] = [
          { code: "01", name: "Hà Nội" },
          { code: "02", name: "Hà Giang" },
          { code: "04", name: "Cao Bằng" },
          { code: "06", name: "Bắc Kạn" },
          { code: "08", name: "Tuyên Quang" },
          { code: "10", name: "Lào Cai" },
          { code: "11", name: "Điện Biên" },
          { code: "12", name: "Lai Châu" },
          { code: "14", name: "Sơn La" },
          { code: "15", name: "Yên Bái" },
          { code: "17", name: "Hòa Bình" },
          { code: "19", name: "Thái Nguyên" },
          { code: "20", name: "Lạng Sơn" },
          { code: "22", name: "Quảng Ninh" },
          { code: "24", name: "Bắc Giang" },
          { code: "25", name: "Phú Thọ" },
          { code: "26", name: "Vĩnh Phúc" },
          { code: "27", name: "Bắc Ninh" },
          { code: "30", name: "Hải Dương" },
          { code: "31", name: "Hải Phòng" },
          { code: "33", name: "Hưng Yên" },
          { code: "34", name: "Thái Bình" },
          { code: "35", name: "Hà Nam" },
          { code: "36", name: "Nam Định" },
          { code: "37", name: "Ninh Bình" },
          { code: "38", name: "Thanh Hóa" },
          { code: "40", name: "Nghệ An" },
          { code: "42", name: "Hà Tĩnh" },
          { code: "44", name: "Quảng Bình" },
          { code: "45", name: "Quảng Trị" },
          { code: "46", name: "Thừa Thiên Huế" },
          { code: "48", name: "Đà Nẵng" },
          { code: "49", name: "Quảng Nam" },
          { code: "51", name: "Quảng Ngãi" },
          { code: "52", name: "Bình Định" },
          { code: "54", name: "Phú Yên" },
          { code: "56", name: "Khánh Hòa" },
          { code: "58", name: "Ninh Thuận" },
          { code: "60", name: "Bình Thuận" },
          { code: "62", name: "Kon Tum" },
          { code: "64", name: "Gia Lai" },
          { code: "66", name: "Đắk Lắk" },
          { code: "67", name: "Đắk Nông" },
          { code: "68", name: "Lâm Đồng" },
          { code: "70", name: "Bình Phước" },
          { code: "72", name: "Tây Ninh" },
          { code: "74", name: "Bình Dương" },
          { code: "75", name: "Đồng Nai" },
          { code: "77", name: "Bà Rịa - Vũng Tàu" },
          { code: "79", name: "Hồ Chí Minh" },
          { code: "80", name: "Long An" },
          { code: "82", name: "Tiền Giang" },
          { code: "83", name: "Bến Tre" },
          { code: "84", name: "Trà Vinh" },
          { code: "86", name: "Vĩnh Long" },
          { code: "87", name: "Đồng Tháp" },
          { code: "89", name: "An Giang" },
          { code: "91", name: "Kiên Giang" },
          { code: "92", name: "Cần Thơ" },
          { code: "93", name: "Hậu Giang" },
          { code: "94", name: "Sóc Trăng" },
          { code: "95", name: "Bạc Liêu" },
          { code: "96", name: "Cà Mau" }
        ];
        
        setProvinces(staticProvinces);
      } catch (err) {
        console.error("Lỗi lấy tỉnh/thành phố:", err);
        setProvinces([]);
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (!customer.province) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        setIsLoadingDistricts(true);
        
        // Sử dụng API backend
        try {
          const provinceCode = customer.province?.code;
          const res = await fetch(`/api/orders/address/districts/${provinceCode}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (res.ok) {
            const responseData = await res.json();
            if (responseData.success) {
              setDistricts(responseData.data);
              return;
            }
          }
        } catch (apiError) {
          console.warn("API backend không khả dụng, sử dụng dữ liệu tĩnh:", apiError);
        }

        // Fallback: Sử dụng dữ liệu tĩnh cho một số tỉnh chính
        const staticDistricts: { [key: string]: Location[] } = {
          "01": [ // Hà Nội
            { code: "001", name: "Ba Đình" },
            { code: "002", name: "Hoàn Kiếm" },
            { code: "003", name: "Tây Hồ" },
            { code: "004", name: "Long Biên" },
            { code: "005", name: "Cầu Giấy" },
            { code: "006", name: "Đống Đa" },
            { code: "007", name: "Hai Bà Trưng" },
            { code: "008", name: "Hoàng Mai" },
            { code: "009", name: "Thanh Xuân" },
            { code: "016", name: "Sóc Sơn" },
            { code: "017", name: "Đông Anh" },
            { code: "018", name: "Gia Lâm" },
            { code: "019", name: "Nam Từ Liêm" },
            { code: "020", name: "Thanh Trì" },
            { code: "021", name: "Bắc Từ Liêm" },
            { code: "250", name: "Mê Linh" },
            { code: "268", name: "Hà Đông" },
            { code: "269", name: "Sơn Tây" },
            { code: "271", name: "Ba Vì" },
            { code: "272", name: "Phúc Thọ" },
            { code: "273", name: "Đan Phượng" },
            { code: "274", name: "Hoài Đức" },
            { code: "275", name: "Quốc Oai" },
            { code: "276", name: "Thạch Thất" },
            { code: "277", name: "Chương Mỹ" },
            { code: "278", name: "Thanh Oai" },
            { code: "279", name: "Thường Tín" },
            { code: "280", name: "Phú Xuyên" },
            { code: "281", name: "Ứng Hòa" },
            { code: "282", name: "Mỹ Đức" }
          ],
          "79": [ // Hồ Chí Minh
            { code: "760", name: "Quận 1" },
            { code: "761", name: "Quận 12" },
            { code: "762", name: "Quận Thủ Đức" },
            { code: "763", name: "Quận 9" },
            { code: "764", name: "Quận Gò Vấp" },
            { code: "765", name: "Quận Bình Thạnh" },
            { code: "766", name: "Quận Tân Bình" },
            { code: "767", name: "Quận Tân Phú" },
            { code: "768", name: "Quận Phú Nhuận" },
            { code: "769", name: "Quận 2" },
            { code: "770", name: "Quận 3" },
            { code: "771", name: "Quận 10" },
            { code: "772", name: "Quận 11" },
            { code: "773", name: "Quận 4" },
            { code: "774", name: "Quận 5" },
            { code: "775", name: "Quận 6" },
            { code: "776", name: "Quận 8" },
            { code: "777", name: "Quận Bình Tân" },
            { code: "778", name: "Quận 7" },
            { code: "783", name: "Huyện Củ Chi" },
            { code: "784", name: "Huyện Hóc Môn" },
            { code: "785", name: "Huyện Bình Chánh" },
            { code: "786", name: "Huyện Nhà Bè" },
            { code: "787", name: "Huyện Cần Giờ" }
          ]
        };

        const provinceCode = customer.province?.code;
        const districtsData = provinceCode ? staticDistricts[provinceCode] || [] : [];
        setDistricts(districtsData);
        
      } catch (err) {
        console.error("Lỗi lấy quận/huyện:", err);
        setDistricts([]);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [customer.province]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!customer.district) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        setIsLoadingWards(true);
        
        // Sử dụng API backend
        try {
          const districtCode = customer.district?.code;
          const res = await fetch(`/api/orders/address/wards/${districtCode}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (res.ok) {
            const responseData = await res.json();
            if (responseData.success) {
              setWards(responseData.data);
              return;
            }
          }
        } catch (apiError) {
          console.warn("API backend không khả dụng, sử dụng dữ liệu tĩnh:", apiError);
        }

        // Fallback: Sử dụng dữ liệu tĩnh cho một số quận/huyện chính
        const staticWards: { [key: string]: Location[] } = {
          "001": [ // Ba Đình
            { code: "00001", name: "Phúc Xá" },
            { code: "00004", name: "Trúc Bạch" },
            { code: "00006", name: "Vĩnh Phúc" },
            { code: "00007", name: "Cống Vị" },
            { code: "00008", name: "Liễu Giai" },
            { code: "00010", name: "Nguyễn Trung Trực" },
            { code: "00013", name: "Quán Thánh" },
            { code: "00016", name: "Ngọc Hà" },
            { code: "00019", name: "Điện Biên" },
            { code: "00022", name: "Đội Cấn" },
            { code: "00025", name: "Ngọc Khánh" },
            { code: "00028", name: "Kim Mã" },
            { code: "00031", name: "Giảng Võ" },
            { code: "00034", name: "Thành Công" }
          ],
          "760": [ // Quận 1
            { code: "26734", name: "Tân Định" },
            { code: "26737", name: "Đa Kao" },
            { code: "26740", name: "Bến Nghé" },
            { code: "26743", name: "Bến Thành" },
            { code: "26746", name: "Nguyễn Thái Bình" },
            { code: "26749", name: "Phạm Ngũ Lão" },
            { code: "26752", name: "Cầu Ông Lãnh" },
            { code: "26755", name: "Cô Giang" },
            { code: "26758", name: "Nguyễn Cư Trinh" },
            { code: "26761", name: "Cầu Kho" }
          ]
        };

        const districtCode = customer.district?.code;
        const wardsData = districtCode ? staticWards[districtCode] || [] : [];
        setWards(wardsData);
        
      } catch (err) {
        console.error("Lỗi lấy phường/xã:", err);
        setWards([]);
      } finally {
        setIsLoadingWards(false);
      }
    };

    fetchWards();
  }, [customer.district]);

  // Custom Address Select Component
  const AddressSelect = ({ 
    value, 
    onValueChange, 
    placeholder, 
    options, 
    disabled, 
    loading 
  }: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: Location[];
    disabled?: boolean;
    loading?: boolean;
  }) => (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <SelectValue placeholder={loading ? "Đang tải..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {options.map((option) => (
          <SelectItem key={option.code} value={option.code} className="py-3">
            <div className="flex items-center">
              <MapPin size={16} className="text-gray-400 mr-2" />
              {option.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Personal Information Section */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <User size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User size={16} className="mr-2 text-gray-500" />
              Họ và tên *
            </label>
            <Input
              type="text"
              placeholder="Nhập họ và tên khách hàng"
              value={customer.fullName || ""}
              onChange={(e) => updateCustomer("fullName", e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Phone size={16} className="mr-2 text-gray-500" />
              Số điện thoại *
            </label>
            <Input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={customer.phone || ""}
              onChange={(e) => updateCustomer("phone", e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
            <Home size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h3>
        </div>
        
        <div className="space-y-6">
          {/* Province */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              Tỉnh/Thành phố *
            </label>
            <AddressSelect
              value={customer.province?.code || ""}
              onValueChange={(value) => {
                const province = provinces.find(p => p.code === value) || null;
                updateCustomer("province", province);
              }}
              placeholder="Chọn tỉnh/thành phố"
              options={provinces}
              loading={isLoadingProvinces}
            />
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              Quận/Huyện *
            </label>
            <AddressSelect
              value={customer.district?.code || ""}
              onValueChange={(value) => {
                const district = districts.find(d => d.code === value) || null;
                updateCustomer("district", district);
              }}
              placeholder="Chọn quận/huyện"
              options={districts}
              disabled={!customer.province}
              loading={isLoadingDistricts}
            />
          </div>

          {/* Ward */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin size={16} className="mr-2 text-gray-500" />
              Phường/Xã *
            </label>
            <AddressSelect
              value={customer.ward?.code || ""}
              onValueChange={(value) => {
                const ward = wards.find(w => w.code === value) || null;
                updateCustomer("ward", ward);
              }}
              placeholder="Chọn phường/xã"
              options={wards}
              disabled={!customer.district}
              loading={isLoadingWards}
            />
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Home size={16} className="mr-2 text-gray-500" />
              Địa chỉ chi tiết *
            </label>
            <Input
              type="text"
              placeholder="Nhập số nhà, tên đường, phường/xã"
              value={customer.street || ""}
              onChange={(e) => updateCustomer("street", e.target.value)}
              className="h-12 bg-gray-50 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-start">
          <Info size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Lưu ý quan trọng:</p>
            <ul className="space-y-1 text-blue-600">
              <li>• Các trường có dấu * là bắt buộc</li>
              <li>• Thông tin sẽ được sử dụng để giao hàng</li>
              <li>• Vui lòng kiểm tra kỹ thông tin trước khi tiếp tục</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}