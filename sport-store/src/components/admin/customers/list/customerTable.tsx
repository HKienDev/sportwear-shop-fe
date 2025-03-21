import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Customer {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  lastActivity: string;
  orderCount: number;
  totalSpent: number;
  avatar: string;
  isActive: boolean;
}

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  onSelectCustomer: (id: string) => void;
}

export default function CustomerTable({ customers, selectedCustomers, onSelectCustomer }: CustomerTableProps) {
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
                    customers.forEach(customer => onSelectCustomer(customer._id));
                  } else {
                    selectedCustomers.forEach(id => onSelectCustomer(id));
                  }
                }}
                checked={selectedCustomers.length === customers.length && customers.length > 0}
              />
            </th>
            <th className="p-4 text-left">Tên Khách Hàng</th>
            <th className="p-4 text-left">Liên Hệ</th>
            <th className="p-4 text-left">Tổng Đơn Hàng</th>
            <th className="p-4 text-left">Tổng Chi Tiêu</th>
            <th className="p-4 text-left">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer._id)}
                    onChange={() => onSelectCustomer(customer._id)}
                  />
                </td>
                <td className="p-4 flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={customer.avatar || "/avatarDefault.jpg"}
                      alt={customer.fullname || "Avatar"}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">
                      <Link 
                        href={`/admin/customers/details/${customer._id}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {customer.fullname || "Khách hàng chưa thêm"}
                      </Link>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {customer.lastActivity || "Chưa có hoạt động"}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center mb-1">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <span>{customer.phone || "Chưa cập nhật"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Link 
                    href={`/admin/customers/details/${customer._id}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {customer.orderCount || 0} đơn
                  </Link>
                </td>
                <td className="p-4">{customer.totalSpent?.toLocaleString() || 0}₫</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      customer.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {customer.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">Không có khách hàng nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 