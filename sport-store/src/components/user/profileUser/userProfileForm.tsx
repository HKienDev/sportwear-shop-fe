"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

type User = {
  customId?: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
};

const UserProfileForm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false); // State để hiển thị modal OTP
  const [otpInput, setOtpInput] = useState(""); // State để lưu giá trị OTP nhập vào

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError("");
        const accessToken = localStorage.getItem("accessToken") ?? "";
        if (!accessToken) {
          setError("Vui lòng đăng nhập để xem thông tin.");
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:4000/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (!res.ok) {
          setError("Không thể kết nối với server hoặc phiên đăng nhập hết hạn.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        const userObject = data.user || data;
        const userData = {
          customId: userObject.customId ?? "",
          fullName: userObject.fullName ?? userObject.username ?? "",
          username: userObject.username ?? "",
          email: userObject.email ?? "",
          phone: userObject.phone ?? "",
          city: userObject.city ?? "",
          district: userObject.district ?? "",
          ward: userObject.ward ?? "",
          address: userObject.address ?? "",
        };
        setUser(userData);
        setTempUser({ ...userData });
      } catch (error) { // Sửa lỗi ESLint
        console.error(error);
        setError("Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (_: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = _.target;
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
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token không tồn tại!");
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error("Không tìm thấy userId từ token!");
      const updateData = {
        userId: userId,
        ...tempUser,
        email: tempUser.email,
      };
      const res = await fetch("http://localhost:4000/api/auth/request-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
      }
      alert("Yêu cầu cập nhật thành công! Vui lòng kiểm tra email để xác nhận.");
    } catch (error) { // Sửa lỗi ESLint
      console.error(error);
      alert("Lỗi: Không thể gửi yêu cầu cập nhật");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUser(user ? { ...user } : null);
  };

  const getUserIdFromToken = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return "";
      const payload = parts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decodedPayload = JSON.parse(jsonPayload);
      return decodedPayload.userId || decodedPayload.id || decodedPayload.sub || "";
    } catch (error) { // Sửa lỗi ESLint
      console.error(error);
      return "";
    }
  };
  

  const handleSaveWithOtp = () => {
    setShowOtpModal(true); // Hiển thị modal OTP khi nhấn "Lưu"
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      alert("Vui lòng nhập mã OTP!");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpInput }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
      }
      alert("Xác thực OTP thành công!");
      setShowOtpModal(false);
      handleRequestUpdate();
    } catch (error) { // Sửa lỗi ESLint
      console.error(error);
      alert("Mã OTP không hợp lệ!");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-red-500">Không thể tải hồ sơ người dùng.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
        <div className="flex items-center mb-4">
          <Image
            src="/Cuoc.png"
            alt="Profile Picture"
            width={64}
            height={64}
            className="rounded-full object-cover"
            priority
          />
          <div className="ml-4">
            <h2 className="text-lg font-bold">{user?.fullName || "Chưa có tên"}</h2>
            <p className="text-gray-600 text-sm">{user?.username || "Chưa có username"}</p>
            <p className="text-gray-600 text-sm">{user?.email || "Chưa có email"}</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mã thành viên</label>
            <input
              type="text"
              value={user?.customId ?? ""}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={isEditing ? tempUser?.fullName ?? "" : user?.fullName ?? ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {user &&
            Object.entries(user).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-600 text-sm">{key.toUpperCase()}</p>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={tempUser?.[key as keyof User] || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p>{value && typeof value === "string" ? value.trim() : "Chưa có"}</p>
                )}
              </div>
            ))}
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
                  onClick={() => setShowOtpModal(false)}
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