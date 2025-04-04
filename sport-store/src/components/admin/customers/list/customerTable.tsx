'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer } from '@/types/customer';
import { Eye, Mail, Phone, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { customerService } from '@/services/customerService';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface CustomerTableProps {
    customers: Customer[];
    onDelete: (id: string) => void;
    onViewDetails: (id: string) => void;
}

export function CustomerTable({
    customers,
    onDelete,
    onViewDetails
}: CustomerTableProps) {
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    
    // Sử dụng useMemo để lọc khách hàng, tránh tính toán lại mỗi khi render
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => customer.role === "user");
    }, [customers]);

    // Cải thiện cách xác định trạng thái online/offline
    useEffect(() => {
        // Trong thực tế, bạn sẽ lấy danh sách người dùng online từ backend
        // Ví dụ: const response = await fetch('/api/online-users');
        // const onlineUsers = await response.json();
        
        // Giả lập trạng thái online/offline dựa trên thời gian hoạt động cuối cùng
        const now = new Date().getTime();
        const onlineIds = new Set(
            filteredCustomers
                .filter(customer => {
                    // Giả sử người dùng online nếu hoạt động trong 5 phút gần đây
                    const lastActiveTime = new Date(customer.updatedAt || customer.createdAt).getTime();
                    const timeDiff = now - lastActiveTime;
                    return timeDiff < 5 * 60 * 1000; // 5 phút
                })
                .map(customer => customer._id)
        );
        setOnlineUsers(onlineIds);
    }, [filteredCustomers]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCustomers(filteredCustomers.map(customer => customer._id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectCustomer = (id: string) => {
        setSelectedCustomers(prev => {
            if (prev.includes(id)) {
                return prev.filter(customerId => customerId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleDelete = async (id: string) => {
        try {
            await customerService.deleteCustomer(id);
            onDelete(id);
            toast.success('Xóa khách hàng thành công');
        } catch {
            toast.error('Xóa khách hàng thất bại');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedCustomers.length === 0) {
            toast.warning('Vui lòng chọn khách hàng cần xóa');
            return;
        }

        try {
            await Promise.all(
                selectedCustomers.map((id) => customerService.deleteCustomer(id))
            );
            selectedCustomers.forEach((id) => onDelete(id));
            setSelectedCustomers([]);
            toast.success('Xóa khách hàng thành công');
        } catch {
            toast.error('Xóa khách hàng thất bại');
        }
    };

    // Hàm kiểm tra trạng thái online
    const isUserOnline = (userId: string) => {
        return onlineUsers.has(userId);
    };

    // Hàm định dạng số tiền
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Tính toán trạng thái "Chọn tất cả" một lần
    const isAllSelected = selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                    />
                    <label
                        htmlFor="select-all"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Chọn tất cả
                    </label>
                </div>
                {selectedCustomers.length > 0 && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa ({selectedCustomers.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Mã thành viên</TableHead>
                            <TableHead>Tên khách hàng</TableHead>
                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                            <TableHead className="hidden sm:table-cell">Số điện thoại</TableHead>
                            <TableHead className="hidden sm:table-cell">Tổng đơn hàng</TableHead>
                            <TableHead className="hidden sm:table-cell">Tổng chi tiêu</TableHead>
                            <TableHead className="hidden sm:table-cell">Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    Không có khách hàng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCustomers.includes(customer._id)}
                                            onCheckedChange={() => handleSelectCustomer(customer._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell font-medium">
                                        <button 
                                            onClick={() => onViewDetails(customer._id)}
                                            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                        >
                                            {customer.customId || customer._id.slice(-6)}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                {customer.avatar ? (
                                                    <Image
                                                        src={customer.avatar}
                                                        alt={customer.fullname}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-gray-500">
                                                            {customer.fullname.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                {isUserOnline(customer._id) && (
                                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{customer.fullname}</div>
                                                <div className="text-xs text-gray-500 sm:hidden">
                                                    {customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span>{customer.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span>{customer.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-1">
                                            <ShoppingBag className="h-4 w-4 text-gray-500" />
                                            <span>{customer.orderCount || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center gap-1">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            <span>{formatCurrency(customer.totalSpent || 0)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            customer.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {customer.isActive ? 'Hoạt động' : 'Khóa'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Mở menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewDetails(customer._id)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    <span>Xem chi tiết</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(customer._id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Xóa</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 