"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { TOKEN_CONFIG } from '@/config/token';

type User = {
  _id?: string;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    district?: string;
    ward?: string;
    detail?: string;
  };
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

const UserProfileForm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Hàm helper để hiển thị giá trị hoặc "Chưa có"
  const displayValue = (value: any) => {
    if (!value) return "Chưa có";
    if (typeof value === 'object') return "Chưa có";
    return value;
  };

  // Hàm helper để hiển thị địa chỉ
  const displayAddress = (address: User['address']) => {
    if (!address) return "Chưa có";
    
    const parts = [];
    if (address.detail) parts.push(address.detail);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    
    return parts.length > 0 ? parts.join(', ') : "Chưa có";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        console.log("Access Token:", accessToken);
        
        if (!accessToken) {
          setError("Vui lòng đăng nhập để xem thông tin.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        console.log("Response status:", res.status);
        
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
        console.log("Response data:", data);
        
        if (data.success) {
          // Đảm bảo address có cấu trúc đúng
          const userData = {
            ...data.data,
            address: {
              street: data.data.address?.street || "",
              city: data.data.address?.city || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser((prevUser) =>
      prevUser ? { ...prevUser, [name]: value } : null
    );
  };

  const handleRequestUpdate = async () => {
    if (!tempUser) {
      alert("Không có dữ liệu để cập nhật!");
      return;
    }
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) throw new Error("Token không tồn tại!");

      const res = await fetch("http://localhost:4000/api/user/request-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: tempUser.email,
          username: tempUser.username,
          fullname: tempUser.fullname,
          phone: tempUser.phone,
          address: tempUser.address,
        }),
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
      alert("Vui lòng nhập mã OTP!");
      return;
    }
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      if (!token) throw new Error("Token không tồn tại!");

      const res = await fetch("http://localhost:4000/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: otpInput }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Lỗi khi xác thực OTP");
      }

      const data = await res.json();
      if (data.success) {
        setUpdateSuccess(true);
        setShowOtpModal(false);
        setOtpInput("");
        setIsEditing(false);
        // Refresh user data
        const userRes = await fetch("http://localhost:4000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) {
            setUser(userData.data);
            setTempUser({ ...userData.data });
          }
        }
      } else {
        throw new Error(data.message || "Lỗi khi xác thực OTP");
      }
    } catch (error) {
      console.error(error);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
        {updateSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            Cập nhật thông tin thành công!
          </div>
        )}
        <div className="flex items-center mb-4">
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="Profile Picture"
            width={64}
            height={64}
            className="rounded-full object-cover"
            priority
          />
          <div className="ml-4">
            <h2 className="text-lg font-bold">{displayValue(user?.fullname)}</h2>
            <p className="text-gray-600 text-sm">{displayValue(user?.username)}</p>
            <p className="text-gray-600 text-sm">{displayValue(user?.email)}</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="fullname"
              value={isEditing ? tempUser?.fullname ?? "" : user?.fullname ?? ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={isEditing ? tempUser?.username ?? "" : user?.username ?? ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={isEditing ? tempUser?.email ?? "" : user?.email ?? ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={isEditing ? tempUser?.phone ?? "" : user?.phone ?? ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    name="address.city"
                    value={tempUser?.address?.city ?? ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Quận/Huyện</label>
                  <input
                    type="text"
                    name="address.district"
                    value={tempUser?.address?.district ?? ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Phường/Xã</label>
                  <input
                    type="text"
                    name="address.ward"
                    value={tempUser?.address?.ward ?? ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    name="address.detail"
                    value={tempUser?.address?.detail ?? ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {displayAddress(user?.address)}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleRequestUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Lưu thay đổi
              </button>
            </>
          )}
        </div>

        {/* Modal OTP */}
        {showOtpModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Xác thực OTP</h2>
              <p className="mb-4">Vui lòng nhập mã OTP đã được gửi đến email của bạn:</p>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="border rounded px-2 py-1 w-full mb-4"
                placeholder="Nhập mã OTP"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded mr-2"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpInput("");
                  }}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleVerifyOtp}
                >
                  Xác thực
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileForm;