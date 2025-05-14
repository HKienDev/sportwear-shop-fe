import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => (
  <div
    className={`animate-pulse bg-gray-200 ${className}`}
    style={style}
    aria-busy="true"
    aria-label="Đang tải..."
  />
);

export default Skeleton;
