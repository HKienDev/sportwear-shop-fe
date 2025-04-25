import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const { product, quantity } = item;

  return (
    <div className="flex items-center py-4 border-b">
      <div className="relative w-24 h-24">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
            disabled={quantity <= 1}
            className="px-2 py-1 border rounded-l hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <span className="px-4 py-1 border-t border-b">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            disabled={quantity >= product.stock}
            className="px-2 py-1 border rounded-r hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      <div className="ml-4 text-right">
        <p className="font-semibold">${(product.price * quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemoveItem(product._id)}
          className="mt-2 text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
} 