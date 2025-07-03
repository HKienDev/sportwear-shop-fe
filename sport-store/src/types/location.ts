// Location types for address management
export interface Location {
  code: string;
  name: string;
}

export interface ProvinceApiData {
  code: number;
  name: string;
  districts?: DistrictApiData[];
}

export interface DistrictApiData {
  code: number;
  name: string;
  wards?: WardApiData[];
}

export interface WardApiData {
  code: number;
  name: string;
}

export interface Address {
  province: string;
  district: string;
  ward: string;
  street: string;
}

export interface AddressWithCodes {
  province: {
    name: string;
    code: number;
  };
  district: {
    name: string;
    code: number;
  };
  ward: {
    name: string;
    code: number;
  };
  street?: string;
} 