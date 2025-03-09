import { IoNotificationsOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  return (
    <div className="w-full bg-white shadow-md h-14 flex items-center justify-between px-6 fixed top-0 left-64 right-0">
      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Bạn cần tìm gì?"
        className="w-1/2 p-2 border border-gray-300 rounded-md outline-none"
      />

      {/* Icon thông báo và avatar user */}
      <div className="flex items-center space-x-4">
        <IoNotificationsOutline size={24} className="cursor-pointer" />
        <FaUserCircle size={28} className="cursor-pointer" />
      </div>
    </div>
  );
}