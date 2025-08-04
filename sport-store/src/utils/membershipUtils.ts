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
  // Find the appropriate tier based on totalSpent
  // Use >= logic to match backend behavior
  if (totalSpent >= 50000000) {
    return MEMBERSHIP_TIERS[4]; // Kim Cương
  } else if (totalSpent >= 10000000) {
    return MEMBERSHIP_TIERS[3]; // Bạch Kim
  } else if (totalSpent >= 5000000) {
    return MEMBERSHIP_TIERS[2]; // Vàng
  } else if (totalSpent >= 2000000) {
    return MEMBERSHIP_TIERS[1]; // Bạc
  } else {
    return MEMBERSHIP_TIERS[0]; // Đồng
  }
};

// Test cases (matching backend logic):
// totalSpent = 0 → Đồng (0 < 2000000)
// totalSpent = 2000000 → Bạc (2000000 >= 2000000)
// totalSpent = 5000000 → Vàng (5000000 >= 5000000)
// totalSpent = 10000000 → Bạch Kim (10000000 >= 10000000)
// totalSpent = 50000000 → Kim Cương (50000000 >= 50000000)
// totalSpent = 100000000 → Kim Cương (100000000 >= 50000000) 