"use client";

import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const AuthButtons = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/user/auth/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    logout();
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/user/profile");
  };

  return (
    <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
      {!user ? (
        <>
          <button onClick={handleLogin} className="text-lg px-5 py-2 border rounded-xl hover:bg-gray-100 font-semibold">
            Đăng Nhập
          </button>
          <Link href="/user/auth/register">
            <button className="text-lg px-5 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-semibold shadow-md">
              Đăng Ký
            </button>
          </Link>
        </>
      ) : user.role === "admin" ? (
        <div className="flex items-center gap-4">
          <Image
            src={user.avatar || "/Cuoc.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-semibold">{user.name} (Admin)</span>
          <Link href="/admin">
            <button className="text-lg px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold shadow-md">
              Quản lý
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="text-lg px-5 py-2 border rounded-xl hover:bg-gray-100 font-semibold"
          >
            Đăng Xuất
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Image
            src={user.avatar || "/Cuoc.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
            onClick={handleProfile}
          />
          <span className="font-semibold">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-lg px-5 py-2 border rounded-xl hover:bg-gray-100 font-semibold"
          >
            Đăng Xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;