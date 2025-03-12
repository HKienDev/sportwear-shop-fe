"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type User = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
};

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUserData = async (forceUpdate = false) => {
    try {
      setLoading(true);
      setError("");

      const accessToken = localStorage.getItem("accessToken") ?? "";
      if (!accessToken) {
        setError("Vui lòng đăng nhập để xem thông tin.");
        setLoading(false);
        return;
      }

      if (!forceUpdate) {
        const cachedUserData = localStorage.getItem("userData");
        if (cachedUserData) {
          const parsedData = JSON.parse(cachedUserData);
          console.log("[DEBUG] Dữ liệu user từ localStorage:", parsedData);
          setUser(parsedData);
          setTempUser({ ...parsedData });
          setLoading(false);
          return; // Không gọi API nếu đã có dữ liệu
        }
      }

      const res = await fetch(`http://localhost:4000/user/profile`, {
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
      console.log("[DEBUG] Dữ liệu từ API profile:", data);

      if (!data || (!data.user && !data)) {
        setError("Dữ liệu không hợp lệ từ server.");
        setLoading(false);
        return;
      }

      const userObject = data.user || data;
      const userData = {
        fullName: userObject.fullName ?? userObject.username ?? "",
        username: userObject.username ?? "",
        email: userObject.email ?? "",
        phone: userObject.phone ?? "",
        city: userObject.city ?? "",
        district: userObject.district ?? "",
        ward: userObject.ward ?? "",
        address: userObject.address ?? "",
      };

      // Cập nhật state ngay lập tức
      setUser(userData);
      setTempUser({ ...userData });

      // Lưu vào localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (error) {
      console.error("[ERROR] Lỗi khi tải hồ sơ người dùng:", error);
      setError("Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token không tồn tại!");
  
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error("Không tìm thấy userId từ token!");
  
      if (!tempUser.email?.trim()) {
        throw new Error("Email không được để trống!");
      }
  
      const updateData = {
        userId,
        ...tempUser,
        email: tempUser.email.trim(),
      };
  
      console.log("[DEBUG] Dữ liệu gửi lên:", updateData);
  
      const res = await fetch("http://localhost:4000/api/auth/request-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      console.log("[DEBUG] Response status:", res.status);
      console.log("[DEBUG] Response headers:", res.headers);
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[ERROR] Server Response:", errorText);
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
      }

      let data;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const responseText = await res.text();
        console.error("[ERROR] Phản hồi không phải JSON:", responseText);
        throw new Error("Server trả về phản hồi không hợp lệ (không phải JSON)");
      }
  
      console.log("[DEBUG] Phản hồi từ request-update:", data);
  
      setShowOtpModal(true);
      setOtpError("");
    } catch (error) {
      console.error("[ERROR] Lỗi khi gửi yêu cầu cập nhật:", error);
      alert(`Lỗi: ${error instanceof Error ? error.message : "Không thể gửi yêu cầu cập nhật"}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpSubmit = async () => {
    try {
      if (!otp || otp.length !== 6) {
        setOtpError("Vui lòng nhập mã OTP 6 số");
        return;
      }

      if (!tempUser || !tempUser.email) {
        setOtpError("Không tìm thấy email người dùng");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token không tồn tại!");

      const res = await fetch("http://localhost:4000/api/auth/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: tempUser.email,
          otp: otp,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Lỗi khi xác thực OTP");
      }

      const data = await res.json();
      console.log("[DEBUG] Cập nhật thành công:", data);

      // Gọi API lấy dữ liệu mới từ backend
      await fetchUserData(true);

      setSuccessMessage("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setShowOtpModal(false);
      setOtp("");
      setIsEditing(false);
    } catch (error) {
      console.error("[ERROR] Lỗi khi xác thực OTP:", error);
      setOtpError(error instanceof Error ? error.message : "Lỗi xác thực OTP");
    }
  };
  
  // Hàm lấy userId từ token JWT (Đã tối ưu)
  const getUserIdFromToken = (token: string): string => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("[ERROR] Token không đúng định dạng JWT");
        return "";
      }
  
      const payload = parts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  
      let jsonPayload;
      try {
        jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
      } catch (decodeError) {
        console.error("[ERROR] Lỗi khi decode Base64:", decodeError);
        return "";
      }
  
      const decodedPayload = JSON.parse(jsonPayload);
      return decodedPayload.userId || decodedPayload.id || decodedPayload.sub || "";
    } catch (error) {
      console.error("[ERROR] Lỗi khi decode token:", error);
      return "";
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUser(user ? {...user} : null); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-red-500">Không thể tải hồ sơ người dùng.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">HỒ SƠ CÁ NHÂN</h1>
      
      {/* Thông báo thành công */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <button
          className="bg-blue-500 text-white rounded px-3 py-1 text-sm"
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
        >
          {isEditing ? "Hủy" : "Cập Nhật"}
        </button>
        {isEditing && (
          <button
            className="bg-green-500 text-white rounded px-3 py-1 text-sm"
            onClick={handleRequestUpdate}
          >
            Lưu
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border rounded p-4">
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

          <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="border rounded p-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p>Hạng Thành Viên <span className="text-purple-500 font-semibold">Kim Cương</span></p>
              <p className="text-blue-500">Tôi đã thăng hạng</p>
            </div>
            <p>Tổng Tiền Tích Lũy: <span className="text-purple-500 font-semibold">123.324.000 VND</span></p>
          </div>

          <div className="mb-6">
            <p className="font-semibold text-gray-700">ĐIỀU KIỆN:</p>
            <p>Tổng số tiền mua hàng tích lũy trong năm nay và năm liền trước đạt từ <span className="text-blue-500">50 triệu đồng</span> trở lên.</p>
          </div>

          <div>
            <p className="font-semibold text-red-500">ƯU ĐÃI MUA HÀNG:</p>
            <p>Giảm 1% áp dụng mua tất tất cả sản phẩm.</p>
            <p>Miễn phí giao hàng áp dụng cho mọi đơn hàng.</p>
          </div>
        </div>
      </div>

      {/* Modal nhập OTP */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác thực OTP</h2>
            <p className="mb-4">Mã OTP đã được gửi đến email của bạn. Vui lòng nhập mã để xác nhận cập nhật thông tin.</p>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nhập mã OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Nhập mã 6 số"
                maxLength={6}
              />
              {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 text-gray-800 rounded px-4 py-2"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                  setOtpError("");
                }}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2"
                onClick={handleOtpSubmit}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;