export function clearAllCartData() {
  // Clear cart data from localStorage
  localStorage.removeItem('cart');
  
  // Clear any other related storage items if they exist
  localStorage.removeItem('cartItems');
  localStorage.removeItem('cartItemIds');
  
  // Reload the page to ensure clean state
  window.location.reload();
} 