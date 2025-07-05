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
        const res = await fetch("https://provinces.open-api.vn/api/?depth=1", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          const formattedProvinces = Array.isArray(data) ? data.map((p: ProvinceApiData) => ({
            code: p.code.toString(),
            name: p.name
          })) : [];
          setProvinces(formattedProvinces);
          return;
        }
      } catch (err) {
        console.warn("API không khả dụng, sử dụng dữ liệu tĩnh:", err);
      }

      // Fallback: Sử dụng dữ liệu tĩnh
      const staticProvinces: Location[] = [
        { code: "01", name: "Hà Nội" },
        { code: "79", name: "Hồ Chí Minh" },
        { code: "48", name: "Đà Nẵng" },
        { code: "92", name: "Cần Thơ" },
        { code: "95", name: "Bạc Liêu" }
      ];
      setProvinces(staticProvinces);
      setLoading(false);
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

        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceData.code}?depth=2`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json() as ProvinceDetailApiData;
          const districtsData = data && Array.isArray(data.districts) 
            ? data.districts.map((d: DistrictApiData) => ({
                code: d.code.toString(),
                name: d.name
              }))
            : [];
          setDistricts(districtsData);
          return;
        }
      } catch (err) {
        console.warn("API không khả dụng, sử dụng dữ liệu tĩnh:", err);
      }

      // Fallback: Sử dụng dữ liệu tĩnh
      const staticDistricts: { [key: string]: Location[] } = {
        "01": [
          { code: "001", name: "Ba Đình" },
          { code: "002", name: "Hoàn Kiếm" },
          { code: "003", name: "Tây Hồ" },
          { code: "004", name: "Long Biên" },
          { code: "005", name: "Cầu Giấy" }
        ],
        "79": [
          { code: "760", name: "Quận 1" },
          { code: "761", name: "Quận 12" },
          { code: "762", name: "Quận Thủ Đức" },
          { code: "763", name: "Quận 9" },
          { code: "764", name: "Quận Gò Vấp" }
        ]
      };
      const provinceData = provinces.find(p => p.name === province);
      if (provinceData) {
        setDistricts(staticDistricts[provinceData.code] || []);
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

        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtData.code}?depth=2`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json() as DistrictDetailApiData;
          const wardsData = data && Array.isArray(data.wards)
            ? data.wards.map((w: WardApiData) => ({
                code: w.code.toString(),
                name: w.name
              }))
            : [];
          setWards(wardsData);
          return;
        }
      } catch (err) {
        console.warn("API không khả dụng, sử dụng dữ liệu tĩnh:", err);
      }

      // Fallback: Sử dụng dữ liệu tĩnh
      const staticWards: { [key: string]: Location[] } = {
        "001": [
          { code: "00001", name: "Phúc Xá" },
          { code: "00004", name: "Trúc Bạch" },
          { code: "00006", name: "Vĩnh Phúc" },
          { code: "00007", name: "Cống Vị" },
          { code: "00008", name: "Liễu Giai" }
        ],
        "760": [
          { code: "26734", name: "Tân Định" },
          { code: "26737", name: "Đa Kao" },
          { code: "26740", name: "Bến Nghé" },
          { code: "26743", name: "Bến Thành" },
          { code: "26746", name: "Nguyễn Thái Bình" }
        ]
      };
      const districtData = districts.find(d => d.name === district);
      if (districtData) {
        setWards(staticWards[districtData.code] || []);
      }
    };

    fetchWards();
  }, [district, districts]);

  return { provinces, districts, wards, loading, error };
};

export default useAddress; 