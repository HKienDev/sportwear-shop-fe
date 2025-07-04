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
          className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-auto"
        >
          Hủy đơn hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Hủy đơn hàng</DialogTitle>
          <DialogDescription className="text-sm">
            Vui lòng nhập lý do hủy đơn hàng. Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-3 sm:gap-4">
            <Label htmlFor="reason" className="text-right text-sm hidden sm:block">
              Lý do
            </Label>
            <Label htmlFor="reason" className="text-sm sm:hidden">
              Lý do hủy đơn hàng
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              className="col-span-1 sm:col-span-3 text-sm"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto text-sm"
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancelOrder}
            disabled={loading || !reason.trim()}
            className="w-full sm:w-auto text-sm"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 