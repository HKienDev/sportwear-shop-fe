import { format, formatDistanceToNow, parse } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format a date string to a readable format (dd/MM/yyyy HH:mm)
 * @param date - The date string or Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date) => {
  try {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format a date string to a readable format (dd/MM/yyyy)
 * @param date - The date string or Date object to format
 * @returns Formatted date string
 */
export const formatDateOnly = (date: string | Date) => {
  try {
    return format(new Date(date), "dd/MM/yyyy", { locale: vi });
  } catch {
    return "Invalid date";
  }
};

/**
 * Calculate the time remaining until a date
 * @param date - The end date string or Date object
 * @returns Time remaining string
 */
export const getTimeRemaining = (date: string | Date) => {
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();

    if (diff < 0) {
      return "Đã hết hạn";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} ngày ${hours} giờ`;
    } else if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    } else {
      return `${minutes} phút`;
    }
  } catch {
    return "Invalid date";
  }
};

// Hàm mới để format ngày tháng cho input datetime-local
export const formatDateForInput = (date: string | Date) => {
  try {
    let dateObj: Date;
    
    if (typeof date === "string") {
      // Kiểm tra nếu chuỗi có định dạng "HH:mm:ss dd/MM/yyyy"
      if (date.includes("/")) {
        // Parse chuỗi theo định dạng Việt Nam
        dateObj = parse(date, "HH:mm:ss dd/MM/yyyy", new Date(), { locale: vi });
      } else {
        // Nếu là ISO string
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Format cho input datetime-local
    return format(dateObj, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    return "";
  }
};

// Hàm mới để parse ngày tháng từ input datetime-local
export const parseDateFromInput = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date;
  } catch (error) {
    return new Date();
  }
};

export const isDateValid = (date: string | Date) => {
  try {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  } catch {
    return false;
  }
};

export const isDateInRange = (date: string | Date, startDate: string | Date, endDate: string | Date) => {
  try {
    const targetDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return targetDate >= start && targetDate <= end;
  } catch {
    return false;
  }
};

export const isDateBefore = (date1: string | Date, date2: string | Date) => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1 < d2;
  } catch {
    return false;
  }
};

export const isDateAfter = (date1: string | Date, date2: string | Date) => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1 > d2;
  } catch {
    return false;
  }
};

/**
 * Format a date string to match API response format (HH:mm:ss dd/MM/yyyy)
 * @param date - The date string or Date object to format
 * @returns Formatted date string
 */
export const formatDateForAPI = (date: string | Date) => {
  try {
    let dateObj: Date;
    
    if (typeof date === "string") {
      // Kiểm tra nếu chuỗi có định dạng "HH:mm:ss dd/MM/yyyy"
      if (date.includes("/")) {
        // Parse chuỗi theo định dạng Việt Nam
        dateObj = parse(date, "HH:mm:ss dd/MM/yyyy", new Date(), { locale: vi });
      } else {
        // Nếu là ISO string
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Format cho API response
    return format(dateObj, "HH:mm:ss dd/MM/yyyy", { locale: vi });
  } catch (error) {
    return "";
  }
}; 