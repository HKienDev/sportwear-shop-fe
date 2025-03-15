import Image from "next/image";

interface ProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ProductItem({ product }: { product: ProductType }) {
  return (
    <div className="flex items-center justify-between border p-2 rounded mt-2">
      <div className="flex items-center space-x-3">
        {/* Dùng next/image thay cho img */}
        <Image
          src={product.image}
          alt={product.name}
          width={64}
          height={64}
          className="rounded"
        />
        <div>
          <p className="text-sm font-semibold">{product.name}</p>
          <p className="text-red-500 text-xs line-through">
            {(product.price * 2).toLocaleString()} VND
          </p>
          <p className="text-blue-600 text-sm">
            {product.price.toLocaleString()} VND SL: {product.quantity}
          </p>
        </div>
      </div>
      <button className="text-red-500">🗑</button>
    </div>
  );
}