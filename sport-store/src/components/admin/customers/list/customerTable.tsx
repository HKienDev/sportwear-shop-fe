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
import { deleteCustomer } from '@/services/customerService';
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
            await deleteCustomer(id);
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
                selectedCustomers.map((id) => deleteCustomer(id))
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
            <div className="flex items-center justify-between">
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
                        className="flex items-center space-x-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Xóa ({selectedCustomers.length})</span>
                    </Button>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Thông tin</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Ngày tham gia</TableHead>
                            <TableHead>Trạng thái</TableHead>
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
                                <TableCell className="font-medium">
                                    {customer._id.slice(-6)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-600">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium">{customer.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {customer.address}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>
                                    {new Date(customer.createdAt).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
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