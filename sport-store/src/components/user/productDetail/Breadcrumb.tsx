import Link from 'next/link';

interface BreadcrumbProps {
  productName: string;
  categoryName: string;
  categorySlug: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ productName, categoryName, categorySlug }) => {
  return (
    <nav className="flex mb-8 text-sm">
      <Link href="/" className="text-gray-500 hover:text-red-600">Trang chủ</Link>
      <span className="mx-2 text-gray-400">/</span>
      <Link href={`/user/products/category/${categorySlug}`} className="text-gray-500 hover:text-red-600">{categoryName}</Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-800 font-medium">{productName}</span>
    </nav>
  );
};

export default Breadcrumb; 