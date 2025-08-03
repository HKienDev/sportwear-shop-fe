// Utility function để log với timestamp
export const logWithTimestamp = (level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
  
  const prefix = `[${timestamp}]`;
  
  switch (level) {
    case 'info':
      console.log(`${prefix} ℹ️ ${message}`, data || '');
      break;
    case 'warn':
      console.warn(`${prefix} ⚠️ ${message}`, data || '');
      break;
    case 'error':
      console.error(`${prefix} ❌ ${message}`, data || '');
      break;
    case 'debug':
      // Chỉ log debug trong development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${prefix} 🔍 ${message}`, data || '');
      }
      break;
  }
};

// Shorthand functions
export const logInfo = (message: string, data?: any) => {
  logWithTimestamp('info', message, data);
};

export const logWarn = (message: string, data?: any) => {
  logWithTimestamp('warn', message, data);
};

export const logError = (message: string, data?: any) => {
  logWithTimestamp('error', message, data);
};

export const logDebug = (message: string, data?: any) => {
  logWithTimestamp('debug', message, data);
}; 