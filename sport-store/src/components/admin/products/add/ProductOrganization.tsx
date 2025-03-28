import { Layers } from "lucide-react";

interface ProductOrganizationProps {
  category: string;
  supplier: string;
  specialOffer: string;
  tag: string;
  onCategoryChange: (value: string) => void;
  onSupplierChange: (value: string) => void;
  onSpecialOfferChange: (value: string) => void;
  onTagChange: (value: string) => void;
}

export default function ProductOrganization({
  category,
  supplier,
  specialOffer,
  tag,
  onCategoryChange,
  onSupplierChange,
  onSpecialOfferChange,
  onTagChange,
}: ProductOrganizationProps) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-6 flex items-center">
        <Layers className="mr-2 text-green-500" size={24} />
        Tổ Chức Sản Phẩm
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="input-label">Thể Loại</label>
          <select 
            className="select-field mt-2"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Chọn thể loại</option>
            <option value="giay-da-bong">Giày đá bóng sân cỏ tự nhiên</option>
            <option value="giay-da-bong-san-nhan-tao">Giày đá bóng sân nhân tạo</option>
            <option value="giay-da-bong-san-futsal">Giày đá bóng sân futsal</option>
          </select>
        </div>

        <div>
          <label className="input-label">Nhà Cung Cấp</label>
          <select 
            className="select-field mt-2"
            value={supplier}
            onChange={(e) => onSupplierChange(e.target.value)}
          >
            <option value="">Chọn nhà cung cấp</option>
            <option value="adidas">Adidas</option>
            <option value="nike">Nike</option>
            <option value="puma">Puma</option>
          </select>
        </div>

        <div>
          <label className="input-label">Ưu Đãi Đặc Biệt</label>
          <select 
            className="select-field mt-2"
            value={specialOffer}
            onChange={(e) => onSpecialOfferChange(e.target.value)}
          >
            <option value="">Chọn ưu đãi</option>
            <option value="none">Không</option>
            <option value="new">Sản phẩm mới</option>
            <option value="hot">Sản phẩm hot</option>
          </select>
        </div>

        <div>
          <label className="input-label">Tag</label>
          <select 
            className="select-field mt-2"
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
          >
            <option value="">Chọn tag</option>
            <option value="none">Không</option>
            <option value="sale">Đang giảm giá</option>
            <option value="limited">Số lượng có hạn</option>
          </select>
        </div>
      </div>
    </div>
  );
} 