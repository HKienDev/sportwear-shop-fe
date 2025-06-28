import { useState, useEffect } from 'react';
import { ThemeColors, ThemeType } from './types';

// Định nghĩa các theme
const themes: Record<ThemeType, ThemeColors> = {
  blue: {
    primary: "#3B82F6",
    primaryHover: "#2563EB",
    primaryLight: "#DBEAFE",
    primaryText: "#1E40AF",
    secondary: "#F8FAFC",
    highlight: "#EFF6FF",
    lightHighlight: "#F1F5F9",
    border: "#E2E8F0"
  },
  purple: {
    primary: "#8B5CF6",
    primaryHover: "#7C3AED",
    primaryLight: "#EDE9FE",
    primaryText: "#5B21B6",
    secondary: "#F8FAFC",
    highlight: "#F5F3FF",
    lightHighlight: "#F1F5F9",
    border: "#E2E8F0"
  },
  green: {
    primary: "#10B981",
    primaryHover: "#059669",
    primaryLight: "#D1FAE5",
    primaryText: "#047857",
    secondary: "#F8FAFC",
    highlight: "#ECFDF5",
    lightHighlight: "#F1F5F9",
    border: "#E2E8F0"
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('blue');

  useEffect(() => {
    // Lấy theme từ localStorage
    const savedTheme = localStorage.getItem('chatTheme') as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (theme: ThemeType) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
      localStorage.setItem('chatTheme', theme);
    }
  };

  const getThemeColors = (): ThemeColors => {
    return themes[currentTheme];
  };

  return {
    currentTheme,
    changeTheme,
    getThemeColors,
    availableThemes: Object.keys(themes) as ThemeType[]
  };
}; 