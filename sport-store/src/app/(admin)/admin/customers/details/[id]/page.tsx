"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/admin/customers/details/header";
import CustomerInfo from "@/components/admin/customers/details/customerInfo";
import MembershipTier from "@/components/admin/customers/details/membershipTier";
import OrderList from "@/components/admin/customers/details/orderList";
import ResetPasswordModal from "@/components/admin/customers/details/resetPasswordModal";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Order } from "@/types/order";
import { customerService } from "@/services/customerService";
import { useAuth } from "@/context/authContext";
import { 
  Location, 
  ProvinceApiData, 
  DistrictApiData, 
  WardApiData, 
  Customer, 
  CustomerUpdateField, 
  CustomerUpdateValue 
} from "@/types";

export default function CustomerDetail() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tempCustomer, setTempCustomer] = useState<Customer | null>(null);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [locationCache, setLocationCache] = useState<{
    districts: { [key: string]: Location[] };
    wards: { [key: string]: Location[] };
  }>({ districts: {}, wards: {} });
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const { user, isAuthenticated, loading } = useAuth();

  // Hàm chuyển đổi ID từ định dạng URL sang MongoDB ID
  const getMongoIdFromUrlId = (urlId: string) => {
    // Nếu ID đã là MongoDB ID hợp lệ, trả về luôn
    if (/^[0-9a-fA-F]{24}$/.test(urlId)) {
      return urlId;
    }
    
    // Nếu ID có định dạng VJUSPORTUSER-, trả về nguyên ID
    if (urlId.startsWith('VJUSPORTUSER-')) {
      return urlId;
    }
    
    // Nếu không phải cả hai trường hợp trên, trả về null
    return null;
  };

  // Helper function để tạo customId
  const getCustomId = (customer: Customer) => {
    return customer.customId || `VJUSPORTUSER-${customer._id.toString().slice(0, 8)}`;
  };

  // Fetch provinces data
  const fetchProvinces = useCallback(async () => {
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProvinces(data.map((p: ProvinceApiData) => ({ 
          code: p.code.toString(), 
          name: p.name 
        })));
        return;
      }
    } catch (error) {
      console.warn('API không khả dụng, sử dụng dữ liệu tĩnh:', error);
    }

    // Fallback: Sử dụng dữ liệu tĩnh
    const staticProvinces = [
      { code: "01", name: "Hà Nội" },
      { code: "79", name: "Hồ Chí Minh" },
      { code: "48", name: "Đà Nẵng" },
      { code: "92", name: "Cần Thơ" },
      { code: "95", name: "Bạc Liêu" }
    ];
    setProvinces(staticProvinces);
  }, []);

  // Fetch districts data
  const fetchDistricts = useCallback(async (provinceCode: string) => {
    // Check cache first
    if (locationCache.districts[provinceCode]) {
      setDistricts(locationCache.districts[provinceCode]);
      return;
    }

    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data: ProvinceApiData = await response.json();
        const districtsData = data.districts?.map((d: DistrictApiData) => ({ 
          code: d.code.toString(), 
          name: d.name 
        })) || [];
        
        setDistricts(districtsData);
        // Cache the result
        setLocationCache(prev => ({
          ...prev,
          districts: { ...prev.districts, [provinceCode]: districtsData }
        }));
        return;
      }
    } catch (error) {
      console.warn('API không khả dụng, sử dụng dữ liệu tĩnh:', error);
    }

    // Fallback: Sử dụng dữ liệu tĩnh
    const staticDistricts: { [key: string]: Array<{ code: string; name: string }> } = {
      "01": [
        { code: "001", name: "Ba Đình" },
        { code: "002", name: "Hoàn Kiếm" },
        { code: "003", name: "Tây Hồ" },
        { code: "004", name: "Long Biên" },
        { code: "005", name: "Cầu Giấy" }
      ],
      "79": [
        { code: "760", name: "Quận 1" },
        { code: "761", name: "Quận 12" },
        { code: "762", name: "Quận Thủ Đức" },
        { code: "763", name: "Quận 9" },
        { code: "764", name: "Quận Gò Vấp" }
      ]
    };
    const districtsData = staticDistricts[provinceCode] || [];
    setDistricts(districtsData);
    // Cache the result
    setLocationCache(prev => ({
      ...prev,
      districts: { ...prev.districts, [provinceCode]: districtsData }
    }));
  }, [locationCache.districts]);

  // Fetch wards data
  const fetchWards = useCallback(async (districtCode: string) => {
    // Check cache first
    if (locationCache.wards[districtCode]) {
      setWards(locationCache.wards[districtCode]);
      return;
    }

    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data: DistrictApiData = await response.json();
        const wardsData = data.wards?.map((w: WardApiData) => ({ 
          code: w.code.toString(), 
          name: w.name 
        })) || [];
        
        setWards(wardsData);
        // Cache the result
        setLocationCache(prev => ({
          ...prev,
          wards: { ...prev.wards, [districtCode]: wardsData }
        }));
        return;
      }
    } catch (error) {
      console.warn('API không khả dụng, sử dụng dữ liệu tĩnh:', error);
    }

    // Fallback: Sử dụng dữ liệu tĩnh
    const staticWards: { [key: string]: Array<{ code: string; name: string }> } = {
      "001": [
        { code: "00001", name: "Phúc Xá" },
        { code: "00004", name: "Trúc Bạch" },
        { code: "00006", name: "Vĩnh Phúc" },
        { code: "00007", name: "Cống Vị" },
        { code: "00008", name: "Liễu Giai" }
      ],
      "760": [
        { code: "26734", name: "Tân Định" },
        { code: "26737", name: "Đa Kao" },
        { code: "26740", name: "Bến Nghé" },
        { code: "26743", name: "Bến Thành" },
        { code: "26746", name: "Nguyễn Thái Bình" }
      ]
    };
    const wardsData = districtCode ? staticWards[districtCode] || [] : [];
    setWards(wardsData);
    // Cache the result
    setLocationCache(prev => ({
      ...prev,
      wards: { ...prev.wards, [districtCode]: wardsData }
    }));
  }, [locationCache.wards]);

  // Fetch customer data
  const fetchCustomerData = useCallback(async () => {
    try {
      setIsLoading(true);
      setCustomerError(null);

      const mongoId = getMongoIdFromUrlId(params.id as string);

      // Lấy thông tin khách hàng
      const userResponse = await fetchWithAuth(`/admin/users/${mongoId}`);
      if (!userResponse.success) {
        throw new Error(userResponse.message || "Không thể tải thông tin khách hàng");
      }
      const customerData = userResponse.data as Customer;
      setCustomer(customerData);

      try {
        // Lấy lịch sử đơn hàng
        const ordersResponse = await fetchWithAuth(`/orders?userId=${customerData._id}`);
        if (ordersResponse.success) {
          setCustomerOrders(ordersResponse.data as Order[]);
        } else {
          console.error("Không thể tải danh sách đơn hàng:", ordersResponse.message);
          // Không throw error, chỉ log và để danh sách đơn hàng trống
          setCustomerOrders([]);
        }
      } catch (orderError) {
        console.error("Lỗi khi tải danh sách đơn hàng:", orderError);
        // Không throw error, chỉ log và để danh sách đơn hàng trống
        setCustomerOrders([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin:", error);
      setCustomerError(error instanceof Error ? error.message : "Có lỗi xảy ra khi tải thông tin");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

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

        // Tải danh sách quận/huyện bằng function đã được cập nhật
        await fetchDistricts(province.code);
        
        // Tìm mã quận/huyện từ tên (sau khi districts đã được load)
        const district = districts.find(d => d.name === customer.address.district);
        if (!district) return;

        // Tải danh sách phường/xã
        await fetchWards(district.code);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu địa chỉ:", error);
      }
    };

    loadLocationData();
  }, [customer, provinces, fetchDistricts, fetchWards, districts]);

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
      const customId = getCustomId(customer);
      const response = await customerService.updateCustomer(customId, tempCustomer);
      if (!response.success) {
        throw new Error(response.message || "Lỗi khi cập nhật thông tin");
      }

      setCustomer(response.data as Customer);
      setTempCustomer(response.data as Customer);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Không thể cập nhật thông tin");
    }
  }, [customer, tempCustomer]);

  // Xử lý xóa khách hàng
  const handleDeleteCustomer = useCallback(async () => {
    if (!customer || !params.id) return;

    if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      return;
    }

    try {
      const customId = getCustomId(customer);
      const response = await customerService.deleteCustomer(customId);
      if (!response.success) {
        throw new Error(response.message || "Lỗi khi xóa khách hàng");
      }

      toast.success("Xóa khách hàng thành công");
      router.push("/admin/customers");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Không thể xóa khách hàng");
    }
  }, [customer, params.id, router]);

  // Xử lý thay đổi mật khẩu
  const handleChangePassword = useCallback(async (newPassword: string) => {
    if (!customer || !params.id) return;

    try {
      const customId = getCustomId(customer);
      const response = await customerService.changePassword(customId, newPassword);
      if (!response.success) {
        throw new Error(response.message || "Lỗi khi thay đổi mật khẩu");
      }

      toast.success("Thay đổi mật khẩu thành công");
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      toast.error("Không thể thay đổi mật khẩu");
    }
  }, [customer, params.id]);

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

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Đang tải thông tin khách hàng...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy khách hàng</h2>
          <p className="text-slate-600 mb-6">Thông tin khách hàng không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => router.push('/admin/customers')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {customerError ? (
          <div className="bg-white rounded-xl shadow-sm border border-rose-200 p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-slate-600">{customerError}</p>
          </div>
        ) : (
          <>
            <Header
              onUpdate={handleUpdateCustomer}
              onDelete={handleDeleteCustomer}
              onResetPassword={() => setIsResetPasswordModalOpen(true)}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-2">
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
              </div>
              
              <div className="lg:col-span-2">
                <MembershipTier
                  totalSpent={tempCustomer?.totalSpent || customer.totalSpent || 0}
                />
              </div>
            </div>

            <OrderList orders={customerOrders} />

            <ResetPasswordModal
              isOpen={isResetPasswordModalOpen}
              onClose={() => setIsResetPasswordModalOpen(false)}
              onSubmit={handleChangePassword}
              customerName={customer?.fullname || "Khách hàng"}
            />
          </>
        )}
      </div>
    </div>
  );
}