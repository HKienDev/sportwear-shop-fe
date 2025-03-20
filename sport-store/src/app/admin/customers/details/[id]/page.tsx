"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Header from "@/components/admin/customers/details/header";
import InfoCard from "@/components/admin/customers/details/infoCard";
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

interface Order {
  id: string;
  totalAmount: number;
  paymentStatus: string;
  shippingStatus: string;
  trackingNumber: string;
  orderDate: string;
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
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [orders] = useState<Order[]>([]);

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

  // Xử lý cập nhật thông tin khách hàng
  const handleUpdateCustomer = useCallback(async (field: CustomerUpdateField, value: CustomerUpdateValue) => {
    if (!customer) return;

    try {
      const { ok, data } = await fetchWithAuth(`/users/admin/${customer._id}`, {
        method: "PUT",
        body: JSON.stringify({ [field]: value }),
      });

      if (!ok) {
        throw new Error("Lỗi khi cập nhật thông tin");
      }

      setCustomer(data as Customer);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Không thể cập nhật thông tin");
    }
  }, [customer]);

  // Xử lý thay đổi địa chỉ
  const handleProvinceChange = useCallback(async (value: string) => {
    if (!customer) return;
    
    try {
      // Tìm tên tỉnh/thành từ danh sách provinces
      const selectedProvince = provinces.find(p => p.code === value);
      if (!selectedProvince) return;

      await handleUpdateCustomer("address", {
        ...customer.address,
        province: selectedProvince.name,
        district: "",
        ward: ""
      });
      await fetchDistricts(value);
      setWards([]);
    } catch (error) {
      console.error("Lỗi khi cập nhật tỉnh/thành:", error);
    }
  }, [customer, handleUpdateCustomer, fetchDistricts, provinces]);

  const handleDistrictChange = useCallback(async (value: string) => {
    if (!customer) return;

    try {
      // Tìm tên quận/huyện từ danh sách districts
      const selectedDistrict = districts.find(d => d.code === value);
      if (!selectedDistrict) return;

      await handleUpdateCustomer("address", {
        ...customer.address,
        district: selectedDistrict.name,
        ward: ""
      });
      await fetchWards(value);
    } catch (error) {
      console.error("Lỗi khi cập nhật quận/huyện:", error);
    }
  }, [customer, handleUpdateCustomer, fetchWards, districts]);

  const handleWardChange = useCallback(async (value: string) => {
    if (!customer) return;

    try {
      // Tìm tên phường/xã từ danh sách wards
      const selectedWard = wards.find(w => w.code === value);
      if (!selectedWard) return;

      await handleUpdateCustomer("address", {
        ...customer.address,
        ward: selectedWard.name
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật phường/xã:", error);
    }
  }, [customer, handleUpdateCustomer, wards]);

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

  const handleChangePassword = useCallback(() => {
    // TODO: Implement change password functionality
    toast.error("Chức năng đang được phát triển");
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!customer) return;
    await fetchCustomerData();
    toast.success("Đã cập nhật thông tin mới nhất");
  }, [customer, fetchCustomerData]);

  // Xử lý đơn hàng
  const handleViewAllOrders = useCallback(() => {
    if (!customer) return;
    router.push(`/admin/orders?customerId=${customer._id}`);
  }, [customer, router]);

  const handleSortOrders = useCallback((sortBy: string) => {
    // TODO: Implement order sorting
    console.log("Sort by:", sortBy);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-neutral-500">Đang tải thông tin khách hàng...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 bg-neutral-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-neutral-500">Không tìm thấy thông tin khách hàng</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-neutral-50 min-h-screen">
      <Header
        onDelete={handleDelete}
        onChangePassword={handleChangePassword}
        onUpdate={handleUpdate}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard 
          title="📦 Tổng Đơn Hàng" 
          value={customer.totalOrders?.toString() || "0"} 
        />
        <InfoCard 
          title="💰 Tổng Chi Tiêu" 
          value={new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(customer.totalSpent || 0)} 
        />
        <InfoCard 
          title="📅 Ngày Tham Gia" 
          value={new Date(customer.createdAt).toLocaleDateString('vi-VN')} 
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <CustomerInfo
          customer={{
            id: customer._id,
            name: customer.fullname,
            avatar: customer.avatar,
            phone: customer.phone,
            province: customer.address.province ? { code: customer.address.province, name: customer.address.province } : undefined,
            district: customer.address.district ? { code: customer.address.district, name: customer.address.district } : undefined,
            ward: customer.address.ward ? { code: customer.address.ward, name: customer.address.ward } : undefined,
            address: {
              province: customer.address.province,
              district: customer.address.district,
              ward: customer.address.ward,
              street: customer.address.street
            }
          }}
          provinces={provinces}
          districts={districts}
          wards={wards}
          onUpdateCustomer={handleUpdateCustomer}
          onProvinceChange={handleProvinceChange}
          onDistrictChange={handleDistrictChange}
          onWardChange={handleWardChange}
        />

        <div className="lg:w-1/3 w-full">
          <MembershipTier totalSpent={customer.totalSpent} />
        </div>
      </div>

      <OrderList
        orders={orders}
        onViewAll={handleViewAllOrders}
        onSort={handleSortOrders}
      />
    </div>
  );
}