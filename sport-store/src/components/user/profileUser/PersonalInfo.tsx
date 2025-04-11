import React from 'react';
import { UserProfile } from '@/types/userProfileTypes';

interface PersonalInfoProps {
  user: UserProfile;
  tempUser: UserProfile | null;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  displayValue: (value: string | undefined | null) => string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  user,
  tempUser,
  isEditing,
  handleChange,
  displayValue,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={tempUser?.fullname || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        ) : (
          <p className="mt-1 text-gray-900">{displayValue(user?.fullname)}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={tempUser?.email || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        ) : (
          <p className="mt-1 text-gray-900">{displayValue(user?.email)}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
        {isEditing ? (
          <input
            type="date"
            name="dob"
            value={tempUser?.dob || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        ) : (
          <p className="mt-1 text-gray-900">{displayValue(user?.dob)}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
        {isEditing ? (
          <input
            type="tel"
            name="phone"
            value={tempUser?.phone || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        ) : (
          <p className="mt-1 text-gray-900">{displayValue(user?.phone)}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
        {isEditing ? (
          <select
            name="gender"
            value={tempUser?.gender || "other"}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        ) : (
          <p className="mt-1 text-gray-900">
            {user?.gender === "male" ? "Nam" : user?.gender === "female" ? "Nữ" : "Khác"}
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo; 