import { useState, useEffect } from 'react';
import { Location } from '@/types/userProfileTypes';

interface UseAddressProps {
  province?: string;
  district?: string;
}

interface UseAddressReturn {
  provinces: Location[];
  districts: Location[];
  wards: Location[];
  loading: boolean;
  error: string | null;
}

// Định nghĩa các interface cho dữ liệu API
interface ProvinceApiData {
  code: number;
  name: string;
}

interface DistrictApiData {
  code: number;
  name: string;
}

interface WardApiData {
  code: number;
  name: string;
}

interface ProvinceDetailApiData {
  districts: DistrictApiData[];
}

interface DistrictDetailApiData {
  wards: WardApiData[];
}

const useAddress = ({ province, district }: UseAddressProps): UseAddressReturn => {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=1");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        const formattedProvinces = Array.isArray(data) ? data.map((p: ProvinceApiData) => ({
          code: p.code.toString(),
          name: p.name
        })) : [];
        
        setProvinces(formattedProvinces);
      } catch (err) {
        console.error("Lỗi lấy tỉnh/thành phố:", err);
        setError("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const provinceData = provinces.find(p => p.name === province);
        if (!provinceData) return;

        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceData.code}?depth=2`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json() as ProvinceDetailApiData;
        
        const districtsData = data && Array.isArray(data.districts) 
          ? data.districts.map((d: DistrictApiData) => ({
              code: d.code.toString(),
              name: d.name
            }))
          : [];
        
        setDistricts(districtsData);
      } catch (err) {
        console.error("Lỗi lấy quận/huyện:", err);
        setError("Không thể tải danh sách quận/huyện");
      }
    };

    fetchDistricts();
  }, [province, provinces]);

  useEffect(() => {
    if (!district) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        const districtData = districts.find(d => d.name === district);
        if (!districtData) return;

        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtData.code}?depth=2`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json() as DistrictDetailApiData;
        
        const wardsData = data && Array.isArray(data.wards)
          ? data.wards.map((w: WardApiData) => ({
              code: w.code.toString(),
              name: w.name
            }))
          : [];
        
        setWards(wardsData);
      } catch (err) {
        console.error("Lỗi lấy phường/xã:", err);
        setError("Không thể tải danh sách phường/xã");
      }
    };

    fetchWards();
  }, [district, districts]);

  return { provinces, districts, wards, loading, error };
};

export default useAddress; 