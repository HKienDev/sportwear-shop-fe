interface UserProfileActionsProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
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
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleRequestUpdate}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Chỉnh sửa thông tin
        </button>
      )}
    </>
  );
};

export default UserProfileActions; 