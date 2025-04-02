'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Customer } from '@/types/customer';
import { Eye, Mail, Phone, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCustomers(customers.map(customer => customer._id));
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
        } catch (error) {
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
        } catch (error) {
            toast.error('Xóa khách hàng thất bại');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={selectedCustomers.length === customers.length}
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
                        className="flex items-center space-x-2 w-full sm:w-auto"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Xóa ({selectedCustomers.length})</span>
                    </Button>
                )}
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead className="hidden sm:table-cell">ID</TableHead>
                            <TableHead>Thông tin</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden lg:table-cell">Số điện thoại</TableHead>
                            <TableHead className="hidden xl:table-cell">Ngày tham gia</TableHead>
                            <TableHead className="hidden sm:table-cell">Trạng thái</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedCustomers.includes(customer._id)}
                                        onCheckedChange={() => handleSelectCustomer(customer._id)}
                                    />
                                </TableCell>
                                <TableCell className="hidden sm:table-cell font-medium">
                                    {customer._id.slice(-6)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-600">
                                                {customer.fullname?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium">{customer.fullname}</div>
                                            <div className="text-sm text-gray-500">
                                                {customer.address?.street || 'Chưa cập nhật'}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                                <TableCell className="hidden lg:table-cell">{customer.phone}</TableCell>
                                <TableCell className="hidden xl:table-cell">
                                    {new Date(customer.createdAt).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge
                                        variant={customer.isActive ? "success" : "destructive"}
                                        className="capitalize"
                                    >
                                        {customer.isActive ? "Hoạt động" : "Không hoạt động"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                            >
                                                <span className="sr-only">Mở menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onViewDetails(customer._id)}
                                                className="cursor-pointer"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(customer._id)}
                                                className="cursor-pointer text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 