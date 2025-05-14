"use client";
import { useState, useEffect } from "react";
import { TOKEN_CONFIG } from '@/config/token';
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  MapPin,
  Award,
  Edit3,
  Check,
  X,
  Loader2,
  UserCheck
} from "lucide-react";
import useAddress from "@/hooks/useAddress";
import { UserProfile } from "@/types/userProfileTypes";
import MembershipTier from "./membershipTier";
import { API_URL } from "@/utils/api";

interface InfoFieldProps {
  label: string;
  name: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  options?: { value: string; label: string }[];
}

const InfoField = ({ label, name, value, isEditing, onChange, type = "text", options }: InfoFieldProps) => {
  const formatDisplayValue = (value: string, type: string) => {
    if (!value) return "Chưa có";
    
    if (type === "date") {
      return value.split('T')[0];
    }
    
    if (type === "select" && name === "gender") {
      switch (value) {
        case "male": return "Nam";
        case "female": return "Nữ";
        case "other": return "Khác";
        default: return value;
      }
    }
    
    return value;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        )
      ) : (
        <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200 truncate" title={formatDisplayValue(value, type)}>
          {formatDisplayValue(value, type)}
        </div>
      )}
    </div>
  );
};

const UserProfileForm = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tempUser, setTempUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const { provinces, districts, wards } = useAddress({
    province: tempUser?.address?.province,
    district: tempUser?.address?.district
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        
        if (!accessToken) {
          setError("Vui lòng đăng nhập để xem thông tin.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        
        if (res.status === 401) {
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Không thể kết nối với server.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        
        if (data.success) {
          const userData = {
            ...data.data,
            address: {
              street: data.data.address?.street || "",
              province: data.data.address?.province || "",
              district: data.data.address?.district || "",
              ward: data.data.address?.ward || "",
              detail: data.data.address?.detail || "",
            }
          };
          setUser(userData);
          setTempUser({ ...userData });
        } else {
          setError(data.message || "Có lỗi xảy ra khi tải thông tin.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setTempUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          }
        };
      });
    } else {
      setTempUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: value
        };
      });
    }
  };

  const handleRequestUpdate = async () => {
    if (!tempUser) {
      alert("Không có dữ liệu để cập nhật!");
      return;
    }

    if (!tempUser.email || !tempUser.username || !tempUser.fullname) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (email, username, họ tên)");
      return;
    }

    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) throw new Error("Token không tồn tại!");

      const updateData = {
        email: tempUser.email,
        username: tempUser.username,
        fullname: tempUser.fullname,
        phone: tempUser.phone || "",
        address: tempUser.address || {
          province: "",
          district: "",
          ward: "",
          street: "",
        },
        dob: tempUser.dob || "",
        gender: tempUser.gender || "other",
      };

      // Log dữ liệu gửi lên để debug
      console.log("Dữ liệu gửi lên update-request:", updateData);

      const res = await fetch(`${API_URL}/auth/profile/update-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Lỗi khi gửi yêu cầu cập nhật");
      }

      const data = await res.json();
      if (data.success) {
        setShowOtpModal(true);
      } else {
        throw new Error(data.message || "Lỗi khi gửi yêu cầu cập nhật");
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Lỗi khi gửi yêu cầu cập nhật");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      alert("Vui lòng nhập mã OTP");
      return;
    }

    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) throw new Error("Token không tồn tại!");

      const updatePayload = {
        otp: otpInput,
        updateData: {
          email: tempUser?.email,
          username: tempUser?.username,
          fullname: tempUser?.fullname,
          phone: tempUser?.phone || "",
          address: {
            province: tempUser?.address?.province || "",
            district: tempUser?.address?.district || "",
            ward: tempUser?.address?.ward || "",
            street: tempUser?.address?.street || "",
          },
          dob: tempUser?.dob || "",
          gender: tempUser?.gender || "other",
        }
      };

      // Log dữ liệu gửi lên để debug
      console.log("Dữ liệu gửi lên update (OTP):", updatePayload);

      const res = await fetch(`${API_URL}/auth/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 400) {
          throw new Error(errorData.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
        } else if (res.status === 401) {
          localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          throw new Error(errorData.message || "Lỗi khi xác thực OTP");
        }
      }

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setShowOtpModal(false);
        setOtpInput("");
        
        // Fetch updated user data
        const userRes = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!userRes.ok) {
          throw new Error("Không thể cập nhật thông tin người dùng");
        }

        const userData = await userRes.json();
        if (userData.success) {
          const updatedUserData = {
            ...userData.data,
            address: {
              street: userData.data.address?.street || "",
              province: userData.data.address?.province || "",
              district: userData.data.address?.district || "",
              ward: userData.data.address?.ward || "",
              detail: userData.data.address?.detail || "",
            }
          };
          setUser(updatedUserData);
          setTempUser(updatedUserData);
        } else {
          throw new Error(userData.message || "Không thể cập nhật thông tin người dùng");
        }
      } else {
        throw new Error(data.message || "Lỗi khi xác thực OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert(error instanceof Error ? error.message : "Lỗi khi xác thực OTP");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUser(user ? { ...user } : null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-red-500">Không thể tải hồ sơ người dùng.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="flex items-center space-x-6 relative z-10">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-inner">
            <UserCheck size={48} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.fullname}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="flex items-center">
                <User size={16} className="mr-1" /> {user?.username}
              </span>
              <span className="flex items-center">
                <Mail size={16} className="mr-1" /> {user?.email}
              </span>
            </div>
            <div className="mt-2 text-sm">
              Thành viên từ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - 6/12 width */}
        <div className="lg:col-span-6 space-y-6">
          {/* Personal Information Card */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="mr-2 text-blue-500" size={20} />
                Thông tin cá nhân
              </h2>
              {!isEditing && (
                <button 
                  className="text-blue-500 hover:text-blue-700 transition-colors flex items-center text-sm font-medium"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} className="mr-1" /> Chỉnh sửa
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField
                  label="Họ và tên"
                  name="fullname"
                  value={tempUser?.fullname || ""}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Tên đăng nhập"
                  name="username"
                  value={tempUser?.username || ""}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Email"
                  name="email"
                  value={tempUser?.email || ""}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="email"
                />
                <InfoField
                  label="Số điện thoại"
                  name="phone"
                  value={tempUser?.phone || ""}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="tel"
                />
                <InfoField
                  label="Ngày sinh"
                  name="dob"
                  value={tempUser?.dob || ""}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="date"
                />
                <InfoField
                  label="Giới tính"
                  name="gender"
                  value={tempUser?.gender || "other"}
                  isEditing={isEditing}
                  onChange={handleChange}
                  type="select"
                  options={[
                    { value: "male", label: "Nam" },
                    { value: "female", label: "Nữ" },
                    { value: "other", label: "Khác" }
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Address Card */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <MapPin className="mr-2 text-blue-500" size={20} />
                Địa chỉ
              </h2>
              {!isEditing && (
                <button 
                  className="text-blue-500 hover:text-blue-700 transition-colors flex items-center text-sm font-medium"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} className="mr-1" /> Chỉnh sửa
                </button>
              )}
            </div>
            <div className="p-6 space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                    <select
                      name="address.province"
                      value={tempUser?.address?.province || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provinces.map(province => (
                        <option key={province.code} value={province.name}>{province.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                    <select
                      name="address.district"
                      value={tempUser?.address?.district || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map(district => (
                        <option key={district.code} value={district.name}>{district.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Ward */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                    <select
                      name="address.ward"
                      value={tempUser?.address?.ward || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map(ward => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                    <input
                      type="text"
                      name="address.street"
                      value={tempUser?.address?.street || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
                  {user?.address?.street || user?.address?.ward || user?.address?.district || user?.address?.province ? (
                    <div className="flex items-start">
                      <MapPin className="mt-1 mr-2 text-gray-500" size={16} />
                      <div>
                        {user.address.street && (
                          <p className="font-medium">{user.address.street}</p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {[
                            user.address.ward,
                            user.address.district,
                            user.address.province
                          ].filter(Boolean).join(", ") || "Chưa có"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có thông tin địa chỉ</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Actions Card */}
          {isEditing && (
            <div className="mt-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-x"></div>
              <div className="relative p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Edit3 className="w-5 h-5 text-blue-600" />
                    </div>
                    Hành động
                  </h2>
                  <div className="text-sm text-gray-500">
                    Bạn có thể lưu hoặc hủy các thay đổi
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleRequestUpdate}
                    disabled={loading}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent group-hover:from-blue-400/30 transition-all duration-300"></div>
                    <div className="relative flex items-center">
                      {loading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        <Check className="mr-2" size={20} />
                      )}
                      <span className="font-medium">Lưu thay đổi</span>
                    </div>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg border border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100/20 to-transparent group-hover:from-gray-200/30 transition-all duration-300"></div>
                    <div className="relative flex items-center">
                      <X className="mr-2" size={20} />
                      <span className="font-medium">Hủy chỉnh sửa</span>
                    </div>
                  </button>
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Lưu ý: Thay đổi sẽ được gửi qua email để xác thực
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - 6/12 width */}
        <div className="lg:col-span-6 space-y-6">
          {/* Membership Card */}
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <Award className="mr-2 text-blue-500" size={20} />
                Thông tin thành viên
              </h2>
            </div>
            <div className="p-6">
              <MembershipTier totalSpent={user?.totalSpent || 0} />
            </div>
          </Card>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4">Xác thực OTP</h3>
            <p className="text-gray-600 mb-6">
              Mã xác thực đã được gửi đến email của bạn. Vui lòng nhập mã để hoàn tất cập nhật.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhập mã OTP</label>
              <div className="flex space-x-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-full aspect-square text-center text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={otpInput[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.match(/^[0-9]$/)) {
                        const newOtp = otpInput.split('');
                        newOtp[index] = val;
                        setOtpInput(newOtp.join(''));
                        // Auto-focus next input
                        if (index < 5) {
                          const nextInput = e.target.nextElementSibling as HTMLInputElement;
                          if (nextInput) {
                            nextInput.focus();
                          }
                        }
                      } else if (val === '') {
                        const newOtp = otpInput.split('');
                        newOtp[index] = '';
                        setOtpInput(newOtp.join(''));
                      }
                    }}
                  />
                ))}
              </div>
              <div className="text-right mt-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Gửi lại mã (60s)
                </button>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpInput.length !== 6}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center ${(loading || otpInput.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <Check className="mr-2" size={18} />
                )}
                Xác nhận
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileForm;