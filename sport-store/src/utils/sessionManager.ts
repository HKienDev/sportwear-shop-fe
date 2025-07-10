import { TOKEN_CONFIG } from '@/config/token';

interface SessionActivity {
  lastActivity: number;
  isActive: boolean;
}

class SessionManager {
  private static instance: SessionManager;
  private activityTimeout: NodeJS.Timeout | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private isTracking = false;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Bắt đầu tracking user activity
  startActivityTracking(): void {
    if (this.isTracking) return;

    this.isTracking = true;
    this.updateLastActivity();

    // Track các events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, this.updateLastActivity.bind(this), true);
    });

    // Track tab visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Track online/offline
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  // Dừng tracking
  stopActivityTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.removeEventListener(event, this.updateLastActivity.bind(this), true);
    });

    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));

    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = null;
    }

    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  // Cập nhật thời gian hoạt động cuối cùng
  private updateLastActivity(): void {
    const activity: SessionActivity = {
      lastActivity: Date.now(),
      isActive: true
    };

    localStorage.setItem('sessionActivity', JSON.stringify(activity));
  }

  // Xử lý khi tab thay đổi visibility
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.updateLastActivity();
      this.checkSessionValidity();
    }
  }

  // Xử lý khi kết nối mạng trở lại
  private handleOnline(): void {
    this.updateLastActivity();
    this.checkSessionValidity();
  }

  // Xử lý khi mất kết nối mạng
  private handleOffline(): void {
    // Network connection lost
  }

  // Kiểm tra tính hợp lệ của session
  private checkSessionValidity(): void {
    const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
    
    if (!accessToken) {
      return;
    }

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Nếu token sắp hết hạn trong 5 phút, trigger refresh
      if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 0) {
        this.triggerTokenRefresh();
      }
    } catch (error) {
      console.error('Error checking session validity:', error);
    }
  }

  // Trigger token refresh
  private triggerTokenRefresh(): void {
    // Dispatch custom event để trigger token refresh
    window.dispatchEvent(new CustomEvent('refreshToken'));
  }

  // Lấy thông tin activity
  getActivityInfo(): SessionActivity | null {
    try {
      const activity = localStorage.getItem('sessionActivity');
      return activity ? JSON.parse(activity) : null;
    } catch (error) {
      console.error('Error getting activity info:', error);
      return null;
    }
  }

  // Kiểm tra xem user có active không
  isUserActive(timeoutMinutes: number = 30): boolean {
    const activity = this.getActivityInfo();
    
    if (!activity) {
      return false;
    }

    const timeSinceLastActivity = Date.now() - activity.lastActivity;
    const timeoutMs = timeoutMinutes * 60 * 1000;

    return timeSinceLastActivity < timeoutMs;
  }

  // Extend session
  extendSession(): void {
    this.updateLastActivity();
    this.triggerTokenRefresh();
  }

  // Clear session data
  clearSession(): void {
    localStorage.removeItem('sessionActivity');
    this.stopActivityTracking();
  }
}

export default SessionManager.getInstance(); 