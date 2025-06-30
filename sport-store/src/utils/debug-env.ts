// Debug environment variables
export const debugEnv = () => {
  console.log('🔍 Debug Environment Variables:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
};

// Export for use in components
export default debugEnv; 