export interface MembershipTier {
  name: string;
  color: string;
  minSpent: number;
  maxSpent: number;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    name: "Đồng",
    color: "#9C7F7F",
    minSpent: 0,
    maxSpent: 2000000
  },
  {
    name: "Bạc", 
    color: "#797979",
    minSpent: 2000000,
    maxSpent: 5000000
  },
  {
    name: "Vàng",
    color: "#FFBE00",
    minSpent: 5000000,
    maxSpent: 10000000
  },
  {
    name: "Bạch Kim",
    color: "#4EB09D",
    minSpent: 10000000, 
    maxSpent: 50000000
  },
  {
    name: "Kim Cương",
    color: "#7C54F3",
    minSpent: 50000000,
    maxSpent: Infinity
  }
];

export const getMembershipTier = (totalSpent: number = 0): MembershipTier => {
  return MEMBERSHIP_TIERS.find(tier => 
    totalSpent >= tier.minSpent && totalSpent < tier.maxSpent
  ) || MEMBERSHIP_TIERS[0]; // Default to Đồng
}; 