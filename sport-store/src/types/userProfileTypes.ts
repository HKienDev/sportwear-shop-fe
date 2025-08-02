export interface Location {
  code: string;
  name: string;
}

export interface ProvinceResponse {
  code: number;
  name: string;
}

export interface DistrictResponse {
  code: number;
  name: string;
  districts?: DistrictResponse[];
}

export interface WardResponse {
  code: number;
  name: string;
  wards?: WardResponse[];
}

export interface UserProfile {
  _id?: string;
  email: string;
  fullname: string;
  phone?: string;
  address?: {
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  membershipTier?: 'Đồng' | 'Bạc' | 'Vàng' | 'Bạch Kim' | 'Kim Cương';
  totalSpent?: number;
  points?: number;
  nextTier?: {
    name: string;
    requiredSpent: number;
    remainingSpent: number;
  };
} 