import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string) => void;
}

export default function ProductTable({ products, selectedProducts, onSelectProduct }: ProductTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto relative">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4">
            <input 
                type="checkbox" 
                onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                    // Nếu checkbox được chọn, thêm tất cả sản phẩm vào danh sách đã chọn
                    products.forEach(product => onSelectProduct(product._id));
                    } else {
                    // Nếu checkbox bị bỏ chọn, xóa tất cả sản phẩm khỏi danh sách đã chọn
                    products.forEach(product => onSelectProduct(product._id)); // Gọi lại để bỏ chọn
                    }
                }}
                checked={selectedProducts.length === products.length && products.length > 0}
            />
            </th>
            <th className="p-4 text-left">Tên Sản Phẩm</th>
            <th className="p-4 text-left">Mô Tả</th>
            <th className="p-4 text-left">Giá</th>
            <th className="p-4 text-left">Tồn Kho</th>
            <th className="p-4 text-left">Danh Mục</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => onSelectProduct(product._id)}
                  />
                </td>
                <td className="p-4 flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={product.imageUrl || "/default-image.png"}
                      alt={product.name || "Product Image"}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">
                      {product.name || "Sản phẩm chưa thêm"}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(product.createdAt).toLocaleDateString() || "Chưa có ngày tạo"}
                    </div>
                  </div>
                </td>
                <td className="p-4">{product.description || "Chưa có mô tả"}</td>
                <td className="p-4">{product.price?.toLocaleString() || 0}₫</td>
                <td className="p-4">{product.stock || 0}</td>
                <td className="p-4">{product.category || "Chưa phân loại"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">Không có sản phẩm nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}