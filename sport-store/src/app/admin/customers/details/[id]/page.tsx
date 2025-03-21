"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/admin/customers/details/header";
import CustomerInfo from "@/components/admin/customers/details/customerInfo";
import MembershipTier from "@/components/admin/customers/details/membershipTier";
import OrderList from "@/components/admin/customers/details/orderList";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Location {
  code: string;
  name: string;
}

interface ProvinceApiData {
  code: number;
  name: string;
  districts?: DistrictApiData[];
}

interface DistrictApiData {
  code: number;
  name: string;
  wards?: WardApiData[];
}

interface WardApiData {
  code: number;
  name: string;
}

interface Customer {
  _id: string;
  fullname: string;
  avatar: string;
  phone: string;
  address: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  totalOrders?: number;
  totalSpent?: number;
  createdAt: string;
  isActive: boolean;
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

export default function CustomerDetail() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tempCustomer, setTempCustomer] = useState<Customer | null>(null);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  // Fetch provinces data
  const fetchProvinces = useCallback(async () => {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      if (!response.ok) throw new Error('Không thể tải danh sách tỉnh thành');
      const data = await response.json();
      setProvinces(data.map((p: ProvinceApiData) => ({ 
        code: p.code.toString(), 
        name: p.name 
      })));
    } catch (error) {
      console.error('Lỗi khi tải danh sách tỉnh thành:', error);
      toast.error('Không thể tải danh sách tỉnh thành');
    }
  }, []);

  // Fetch districts data
  const fetchDistricts = useCallback(async (provinceCode: string) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      if (!response.ok) throw new Error('Không thể tải danh sách quận huyện');
      const data: ProvinceApiData = await response.json();
      setDistricts(data.districts?.map((d: DistrictApiData) => ({ 
        code: d.code.toString(), 
        name: d.name 
      })) || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách quận huyện:', error);
      toast.error('Không thể tải danh sách quận huyện');
    }
  }, []);

  // Fetch wards data
  const fetchWards = useCallback(async (districtCode: string) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      if (!response.ok) throw new Error('Không thể tải danh sách phường xã');
      const data: DistrictApiData = await response.json();
      setWards(data.wards?.map((w: WardApiData) => ({ 
        code: w.code.toString(), 
        name: w.name 
      })) || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phường xã:', error);
      toast.error('Không thể tải danh sách phường xã');
    }
  }, []);

  // Fetch customer data
  const fetchCustomerData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { ok, status, data } = await fetchWithAuth(`/users/${params.id}`);
      
      if (!ok) {
        if (status === 404) {
          toast.error("Không tìm thấy thông tin khách hàng");
          router.push("/admin/customers/list");
          return;
        }
        throw new Error("Lỗi khi tải thông tin khách hàng");
      }

      setCustomer(data as Customer);
    } catch (error) {
      console.error("Lỗi khi tải thông tin khách hàng:", error);
      toast.error("Không thể tải thông tin khách hàng");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  // Fetch initial data
  useEffect(() => {
    fetchCustomerData();
    fetchProvinces();
  }, [fetchCustomerData, fetchProvinces]);

  // Tải danh sách quận/huyện và phường/xã khi có dữ liệu khách hàng
  useEffect(() => {
    const loadLocationData = async () => {
      if (!customer) return;

      try {
        // Tìm mã tỉnh/thành từ tên
        const province = provinces.find(p => p.name === customer.address.province);
        if (!province) return;

        // Tải danh sách quận/huyện
        const districtsResponse = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
        if (!districtsResponse.ok) throw new Error('Không thể tải danh sách quận huyện');
        const districtsData: ProvinceApiData = await districtsResponse.json();
        const newDistricts = districtsData.districts?.map((d: DistrictApiData) => ({ 
          code: d.code.toString(), 
          name: d.name 
        })) || [];
        setDistricts(newDistricts);
        
        // Tìm mã quận/huyện từ tên
        const district = newDistricts.find(d => d.name === customer.address.district);
        if (!district) return;

        // Tải danh sách phường/xã
        await fetchWards(district.code);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu địa chỉ:", error);
      }
    };

    loadLocationData();
  }, [customer, provinces, fetchWards]);

  // Xử lý thay đổi tạm thời
  const handleDataChange = useCallback((field: CustomerUpdateField, value: CustomerUpdateValue) => {
    if (!tempCustomer) return;
    
    setTempCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  }, [tempCustomer]);

  // Cập nhật tempCustomer khi customer thay đổi
  useEffect(() => {
    if (customer) {
      setTempCustomer(customer);
    }
  }, [customer]);

  // Xử lý cập nhật thông tin khách hàng
  const handleUpdateCustomer = useCallback(async () => {
    if (!tempCustomer || !customer) return;

    try {
      const { ok, data } = await fetchWithAuth(`/users/admin/${customer._id}`, {
        method: "PUT",
        body: JSON.stringify(tempCustomer),
      });

      if (!ok) {
        throw new Error("Lỗi khi cập nhật thông tin");
      }

      setCustomer(data as Customer);
      setTempCustomer(data as Customer);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Không thể cập nhật thông tin");
    }
  }, [customer, tempCustomer]);

  // Xử lý thay đổi địa chỉ
  const handleProvinceChange = useCallback(async (value: string) => {
    if (!customer || !tempCustomer) return;
    
    try {
      // Tìm tên tỉnh/thành từ danh sách provinces
      const selectedProvince = provinces.find(p => p.code === value);
      if (!selectedProvince) return;

      // Tải danh sách quận/huyện trước
      await fetchDistricts(value);
      setWards([]);

      // Cập nhật tempCustomer
      setTempCustomer(prev => {
        if (!prev) return null;
        return {
          ...prev,
          address: {
            province: selectedProvince.name,
            district: "",
            ward: "",
            street: prev.address.street
          }
        };
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật tỉnh/thành:", error);
    }
  }, [customer, tempCustomer, fetchDistricts, provinces]);

  const handleDistrictChange = useCallback(async (value: string) => {
    if (!customer || !tempCustomer) return;

    try {
      // Tìm tên quận/huyện từ danh sách districts
      const selectedDistrict = districts.find(d => d.code === value);
      if (!selectedDistrict) return;

      // Cập nhật tempCustomer
      setTempCustomer(prev => {
        if (!prev) return null;
        return {
          ...prev,
          address: {
            province: prev.address.province,
            district: selectedDistrict.name,
            ward: "",
            street: prev.address.street
          }
        };
      });

      // Tải danh sách phường/xã sau khi cập nhật tempCustomer
      await fetchWards(value);
    } catch (error) {
      console.error("Lỗi khi cập nhật quận/huyện:", error);
    }
  }, [customer, tempCustomer, fetchWards, districts]);

  const handleWardChange = useCallback(async (value: string) => {
    if (!customer || !tempCustomer) return;

    try {
      // Tìm tên phường/xã từ danh sách wards
      const selectedWard = wards.find(w => w.code === value);
      if (!selectedWard) return;

      // Cập nhật tempCustomer
      setTempCustomer(prev => {
        if (!prev) return null;
        return {
          ...prev,
          address: {
            province: prev.address.province,
            district: prev.address.district,
            ward: selectedWard.name,
            street: prev.address.street
          }
        };
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật phường/xã:", error);
    }
  }, [customer, tempCustomer, wards]);

  // Xử lý các hành động chính
  const handleDelete = useCallback(async () => {
    if (!customer || !confirm("Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác!")) {
      return;
    }

    try {
      const response = await fetchWithAuth(`/users/admin/${customer._id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Lỗi khi xóa khách hàng");
      }

      toast.success("Xóa khách hàng thành công");
      router.push("/admin/customers/list");
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      toast.error("Không thể xóa khách hàng");
    }
  }, [customer, router]);

  const handleChangePassword = useCallback(async () => {
    if (!customer) return;

    try {
      const { ok } = await fetchWithAuth(`/users/admin/${customer._id}/reset-password`, {
        method: "POST"
      });

      if (!ok) {
        throw new Error("Lỗi khi đặt lại mật khẩu");
      }

      toast.success("Đặt lại mật khẩu thành công");
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      toast.error("Không thể đặt lại mật khẩu");
    }
  }, [customer]);

  // Chuyển đổi Customer sang CustomerData
  const convertToCustomerData = (customer: Customer) => {
    // Tìm mã tỉnh/thành từ tên
    const province = provinces.find(p => p.name === customer.address.province);
    // Tìm mã quận/huyện từ tên
    const district = districts.find(d => d.name === customer.address.district);
    // Tìm mã phường/xã từ tên
    const ward = wards.find(w => w.name === customer.address.ward);

    return {
      id: customer._id,
      name: customer.fullname,
      avatar: customer.avatar,
      phone: customer.phone,
      address: customer.address,
      province,
      district,
      ward
    };
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Không tìm thấy thông tin khách hàng</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Header
        onDelete={handleDelete}
        onChangePassword={handleChangePassword}
        onUpdate={handleUpdateCustomer}
      />
      
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <CustomerInfo
          customer={convertToCustomerData(tempCustomer || customer)}
          provinces={provinces}
          districts={districts}
          wards={wards}
          onProvinceChange={handleProvinceChange}
          onDistrictChange={handleDistrictChange}
          onWardChange={handleWardChange}
          onDataChange={handleDataChange}
        />
        
        <MembershipTier
          totalSpent={tempCustomer?.totalSpent || customer.totalSpent || 0}
        />
      </div>

      <OrderList phone={tempCustomer?.phone || customer.phone} />
    </div>
  );
}