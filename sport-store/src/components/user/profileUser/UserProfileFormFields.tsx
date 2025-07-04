import { UserProfile } from "@/types/userProfileTypes";

interface UserProfileFormFieldsProps {
  isEditing: boolean;
  user: UserProfile | null;
  tempUser: UserProfile | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const UserProfileFormFields = ({
  isEditing,
  user,
  tempUser,
  handleChange,
}: UserProfileFormFieldsProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          {isEditing ? (
            <input
              type="text"
              name="fullname"
              value={tempUser?.fullname || ""}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-xs sm:text-sm"
              placeholder="Nhập họ và tên"
            />
          ) : (
            <p className="text-xs sm:text-sm text-gray-900 truncate">{user?.fullname || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={tempUser?.email || ""}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-xs sm:text-sm"
              placeholder="Nhập email"
            />
          ) : (
            <p className="text-xs sm:text-sm text-gray-900 truncate">{user?.email || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={tempUser?.phone || ""}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-xs sm:text-sm"
              placeholder="Nhập số điện thoại"
            />
          ) : (
            <p className="text-xs sm:text-sm text-gray-900 truncate">{user?.phone || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={tempUser?.dob?.split('T')[0] || ""}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-xs sm:text-sm"
            />
          ) : (
            <p className="text-xs sm:text-sm text-gray-900 truncate">
              {user?.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : "Chưa có"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Giới tính</label>
          {isEditing ? (
            <select
              name="gender"
              value={tempUser?.gender || ""}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-xs sm:text-sm"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          ) : (
            <p className="text-xs sm:text-sm text-gray-900 truncate">
              {user?.gender === "male" ? "Nam" : user?.gender === "female" ? "Nữ" : "Khác"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileFormFields; 