// Test script để kiểm tra API coupons
const testCouponsAPI = async () => {
  try {
    console.log('🔍 Testing Coupons API...');
    
    // Test 1: Lấy tất cả coupons
    console.log('\n📋 Test 1: Lấy tất cả coupons');
    const response1 = await fetch('http://localhost:3000/api/coupons/public?status=active&limit=50');
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Data:', JSON.stringify(data1, null, 2));
    
    // Test 2: Lấy coupons với filter
    console.log('\n📋 Test 2: Lấy coupons với filter');
    const response2 = await fetch('http://localhost:3000/api/coupons/public?status=Hoạt động&limit=10');
    const data2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Data:', JSON.stringify(data2, null, 2));
    
    // Test 3: Test backend trực tiếp
    console.log('\n📋 Test 3: Test backend trực tiếp');
    const response3 = await fetch('http://localhost:4000/api/coupons?status=active&limit=10');
    const data3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Data:', JSON.stringify(data3, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
};

// Chạy test
testCouponsAPI(); 