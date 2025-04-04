import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CouponFilterProps {
  onFilter: (status: string | null) => void;
}

const CouponFilter: React.FC<CouponFilterProps> = ({ onFilter }) => {
  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={(value) => onFilter(value === "all" ? null : value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="Hoạt động">Hoạt động</SelectItem>
          <SelectItem value="Tạm Dừng">Tạm dừng</SelectItem>
          <SelectItem value="Hết hạn">Hết hạn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CouponFilter; 