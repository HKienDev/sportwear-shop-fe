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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          {isEditing ? (
            <input
              type="text"
              name="fullname"
              value={tempUser?.fullname || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Nhập họ và tên"
            />
          ) : (
            <p className="text-gray-900">{user?.fullname || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={tempUser?.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Nhập email"
            />
          ) : (
            <p className="text-gray-900">{user?.email || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={tempUser?.phone || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Nhập số điện thoại"
            />
          ) : (
            <p className="text-gray-900">{user?.phone || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={tempUser?.dob?.split('T')[0] || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            />
          ) : (
            <p className="text-gray-900">
              {user?.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : "Chưa có"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
          {isEditing ? (
            <select
              name="gender"
              value={tempUser?.gender || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          ) : (
            <p className="text-gray-900">
              {user?.gender === "male" ? "Nam" : user?.gender === "female" ? "Nữ" : "Khác"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileFormFields; 