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
import { 
  User, 
  Calendar, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

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
  const [isUpdating, setIsUpdating] = useState(false);
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
        // Lấy lịch sử đơn hàng - tìm theo cả userId và phone
        let allOrders: Order[] = [];
        
        console.log("Customer data:", customerData);
        console.log("Searching orders for userId:", customerData._id);
        console.log("Searching orders for phone:", customerData.phone);
        
        // Tìm theo userId
        const ordersByUserIdResponse = await fetchWithAuth(`/orders?userId=${customerData._id}`);
        console.log("Orders by userId response:", ordersByUserIdResponse);
        if (ordersByUserIdResponse.success) {
          const userIdOrders = ordersByUserIdResponse.data as Order[];
          allOrders = [...allOrders, ...userIdOrders];
          console.log("Orders found by userId:", userIdOrders.length);
        }
        
        // Tìm theo phone - tìm tất cả đơn hàng có số điện thoại này
        const ordersByPhoneResponse = await fetchWithAuth(`/orders/phone/${customerData.phone}`);
        console.log("Orders by phone response:", ordersByPhoneResponse);
        if (ordersByPhoneResponse.success) {
          const phoneOrders = ordersByPhoneResponse.data as Order[];
          console.log("Orders found by phone:", phoneOrders.length);
          // Loại bỏ trùng lặp dựa trên _id
          const existingIds = new Set(allOrders.map(order => order._id));
          const uniquePhoneOrders = phoneOrders.filter(order => !existingIds.has(order._id));
          allOrders = [...allOrders, ...uniquePhoneOrders];
        }
        
        // Sắp xếp theo ngày tạo mới nhất
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        console.log("Total orders found:", allOrders.length);
        setCustomerOrders(allOrders);
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
      setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
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

  // Tính toán stats
  const getCustomerStats = () => {
    if (!customer || !customerOrders) return null;

    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const completedOrders = customerOrders.filter(order => order.status === 'delivered').length;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      totalSpent,
      completedOrders,
      averageOrderValue
    };
  };

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Loading Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-200 rounded-lg animate-pulse mb-2 w-48"></div>
                  <div className="h-4 bg-slate-200 rounded-lg animate-pulse w-32"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-slate-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy khách hàng</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thông tin khách hàng không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/admin/customers')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </button>
            <button
              onClick={() => fetchCustomerData()}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium flex items-center gap-2 justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getCustomerStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {customerError ? (
          <div className="bg-white rounded-2xl shadow-sm border border-rose-200 p-8 text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Có lỗi xảy ra</h3>
            <p className="text-slate-600 mb-6">{customerError}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => fetchCustomerData()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 justify-center"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </button>
              <button
                onClick={() => router.push('/admin/customers')}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 font-medium flex items-center gap-2 justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
            </div>
          </div>
        ) : (
          <>
            <Header
              onUpdate={handleUpdateCustomer}
              onDelete={handleDeleteCustomer}
              onResetPassword={() => setIsResetPasswordModalOpen(true)}
              isUpdating={isUpdating}
            />
            
            {/* Customer Stats */}
            {stats && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Tổng đơn hàng</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Tổng chi tiêu</p>
                        <p className="text-2xl font-bold text-slate-800">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Đơn hoàn thành</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.completedOrders}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Giá trị TB</p>
                        <p className="text-2xl font-bold text-slate-800">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.averageOrderValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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