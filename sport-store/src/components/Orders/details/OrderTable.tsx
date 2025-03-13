import Image from "next/image";

const orderItems = [
    {
      id: 1,
      name: "Nike Air Zoom Mercurial Superfly X Elite FG",
      type: "Giày sân cỏ tự nhiên",
      color: "Mặc định",
      quantity: 2,
      price: "4.000.000 VND",
      image: "/shoes.png",
    },
    {
      id: 2,
      name: "Adidas Predator Accuracy.1 FG",
      type: "Giày sân cỏ nhân tạo",
      color: "Đen/Trắng",
      quantity: 1,
      price: "3.800.000 VND",
      image: "/shoes.png",
    },
    {
      id: 3,
      name: "Puma Ultra Ultimate FG/AG",
      type: "Giày đa năng (FG/AG)",
      color: "Cam/Navy",
      quantity: 3,
      price: "3.500.000 VND",
      image: "/shoes.png",
    },
    {
      id: 4,
      name: "Mizuno Morelia Neo III Beta",
      type: "Giày da Kangaroo",
      color: "Trắng/Vàng",
      quantity: 2,
      price: "4.500.000 VND",
      image: "/shoes.png",
    },
    {
      id: 5,
      name: "New Balance Furon v7 Pro FG",
      type: "Giày sân cỏ tự nhiên",
      color: "Xanh/Đỏ",
      quantity: 1,
      price: "3.600.000 VND",
      image: "/shoes.png",
    },
  ];

export default function OrderTable() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-700">
            <th className="px-4 py-2">Sản phẩm</th>
            <th className="px-4 py-2">Thể loại</th>
            <th className="px-4 py-2">Màu</th>
            <th className="px-4 py-2">Số lượng</th>
            <th className="px-4 py-2">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 flex items-center space-x-3">
                {/* Sử dụng `next/image` thay vì thẻ `<img>` */}
                <div className="relative w-12 h-12">
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {item.name}
                </span>
              </td>
              <td className="px-4 py-2">{item.type}</td>
              <td className="px-4 py-2">{item.color}</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2 font-semibold">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}