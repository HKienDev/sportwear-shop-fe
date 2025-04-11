import { UserProfile, Location } from "@/types/userProfileTypes";

interface UserProfileAddressProps {
  isEditing: boolean;
  user: UserProfile | null;
  tempUser: UserProfile | null;
  provinces: Location[];
  districts: Location[];
  wards: Location[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  displayAddress: (address: UserProfile['address']) => string;
}

const UserProfileAddress = ({
  isEditing,
  user,
  tempUser,
  provinces,
  districts,
  wards,
  handleChange,
  displayAddress,
}: UserProfileAddressProps) => {
  // Log provinces for debugging
  console.log("Provinces in component:", provinces);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố</label>
          {isEditing ? (
            <select
              name="address.province"
              value={tempUser?.address?.province || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces && provinces.length > 0 ? (
                provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Đang tải dữ liệu...</option>
              )}
            </select>
          ) : (
            <p className="text-gray-900 text-lg">{user?.address?.province || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện</label>
          {isEditing ? (
            <select
              name="address.district"
              value={tempUser?.address?.district || ""}
              onChange={handleChange}
              disabled={!tempUser?.address?.province}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900 text-lg">{user?.address?.district || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã</label>
          {isEditing ? (
            <select
              name="address.ward"
              value={tempUser?.address?.ward || ""}
              onChange={handleChange}
              disabled={!tempUser?.address?.district}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900 text-lg">{user?.address?.ward || "Chưa có"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết</label>
          {isEditing ? (
            <input
              type="text"
              name="address.street"
              value={tempUser?.address?.street || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
              placeholder="Nhập địa chỉ chi tiết"
            />
          ) : (
            <p className="text-gray-900 text-lg">{user?.address?.street || "Chưa có"}</p>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Địa chỉ đầy đủ</h4>
          <p className="text-gray-900 text-lg">
            {displayAddress(user?.address || {})}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfileAddress; 