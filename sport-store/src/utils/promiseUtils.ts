/**
 * Wrapper để xử lý Promise an toàn hơn
 */
export const safePromise = async <T>(
  promise: Promise<T>,
  errorMessage: string = 'Có lỗi xảy ra'
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    console.log('🔄 Bắt đầu xử lý Promise...');
    const data = await promise;
    console.log('✅ Promise thành công:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Promise error:', error);
    const errorMsg = error instanceof Error ? error.message : errorMessage;
    return { success: false, error: errorMsg };
  }
};

/**
 * Wrapper để xử lý multiple Promise an toàn hơn
 */
export const safePromiseAll = async <T>(
  promises: Promise<T>[],
  errorMessage: string = 'Có lỗi xảy ra'
): Promise<{ success: boolean; data?: T[]; error?: string }> => {
  try {
    console.log('🔄 Bắt đầu xử lý Promise.all...');
    const data = await Promise.all(promises);
    console.log('✅ Promise.all thành công:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Promise.all error:', error);
    const errorMsg = error instanceof Error ? error.message : errorMessage;
    return { success: false, error: errorMsg };
  }
};

/**
 * Wrapper để xử lý Promise với timeout
 */
export const promiseWithTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number = 30000,
  errorMessage: string = 'Request timeout'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}; 