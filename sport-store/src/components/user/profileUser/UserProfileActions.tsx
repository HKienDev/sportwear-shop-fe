import React from 'react';

interface UserProfileActionsProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleCancel: () => void;
  handleRequestUpdate: () => void;
}

const UserProfileActions = ({
  isEditing,
  setIsEditing,
  handleCancel,
  handleRequestUpdate,
}: UserProfileActionsProps) => {
  return (
    <>
      {isEditing ? (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleCancel}
            className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleRequestUpdate}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Lưu thay đổi
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
        >
          Chỉnh sửa thông tin
        </button>
      )}
    </>
  );
};

export default UserProfileActions; 