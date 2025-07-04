import Image from "next/image";
import { UserProfile } from "@/types/userProfileTypes";

interface UserProfileHeaderProps {
  user: UserProfile | null;
  displayValue: (value: string | undefined | null) => string;
}

const UserProfileHeader = ({ user, displayValue }: UserProfileHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white rounded-md border border-gray-200">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        <Image
          src={user?.avatar || "/images/avatarDefault.jpg"}
          alt="Profile Picture"
          fill
          className="rounded-full object-cover border-2 border-red-100"
          priority
        />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{displayValue(user?.fullname)}</h2>
        <div className="mt-1 sm:mt-2 space-y-1 sm:space-y-0.5">
          <p className="text-xs sm:text-sm text-gray-600 flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">Thành viên</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-600 flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{displayValue(user?.email)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;