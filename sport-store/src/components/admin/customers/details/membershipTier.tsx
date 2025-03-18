interface MembershipTierProps {
  currentSpent: number;
  nextTierThreshold: number;
}

export default function MembershipTier({ currentSpent, nextTierThreshold }: MembershipTierProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const progress = (currentSpent / nextTierThreshold) * 100;
  const remainingAmount = nextTierThreshold - currentSpent;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-xl">
      <h3 className="text-lg font-semibold mb-4">HẠNG THÀNH VIÊN</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tổng chi tiêu</span>
            <span>{formatCurrency(currentSpent)}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Hạng hiện tại</span>
            <span className="font-semibold">
              {currentSpent >= nextTierThreshold ? "VIP" : "Thành viên"}
            </span>
          </div>
          
          {currentSpent < nextTierThreshold && (
            <div className="text-sm">
              <p>Còn {formatCurrency(remainingAmount)} để đạt hạng VIP</p>
              <p className="mt-2 text-white/80">
                Tận hưởng ưu đãi đặc biệt khi đạt hạng VIP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 