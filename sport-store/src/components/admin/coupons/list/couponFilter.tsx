import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CouponFilterProps {
  onFilter: (status: string | undefined) => void;
}

const CouponFilter: React.FC<CouponFilterProps> = ({ onFilter }) => {
  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={(value) => onFilter(value === "all" ? undefined : value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Tạm dừng</SelectItem>
          <SelectItem value="expired">Hết hạn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CouponFilter; 