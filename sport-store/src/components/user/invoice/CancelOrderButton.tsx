'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/constants';

interface CancelOrderButtonProps {
  orderId: string;
  onCancelSuccess?: () => void;
  disabled?: boolean;
}

export default function CancelOrderButton({ orderId, onCancelSuccess, disabled = false }: CancelOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.updateOrderStatus(orderId, 'cancelled', { note: reason });
      
      if (response.data.success) {
        toast.success(SUCCESS_MESSAGES.ORDER_CANCELLED);
        setOpen(false);
        setReason('');
        onCancelSuccess?.();
      } else {
        throw new Error(response.data.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;
      toast.error(errorMessage);
      console.error('Cancel order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          disabled={disabled}
        >
          Hủy đơn hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hủy đơn hàng</DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do hủy đơn hàng. Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Lý do
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancelOrder}
            disabled={loading || !reason.trim()}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 