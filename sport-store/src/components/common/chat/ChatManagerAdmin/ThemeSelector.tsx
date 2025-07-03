import React from 'react';
import { ThemeType, ThemeColors } from './types';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  isOpen,
  onToggle
}) => {
  const themes: { type: ThemeType; name: string; color: string }[] = [
    { type: 'blue', name: 'Xanh dương', color: '#3B82F6' },
    { type: 'purple', name: 'Tím', color: '#8B5CF6' },
    { type: 'green', name: 'Xanh lá', color: '#10B981' }
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
        title="Thay đổi theme"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M5 5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn theme</h3>
            <div className="space-y-2">
              {themes.map((theme) => (
                <button
                  key={theme.type}
                  onClick={() => {
                    onThemeChange(theme.type);
                    onToggle();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    currentTheme === theme.type
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: theme.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{theme.name}</span>
                  {currentTheme === theme.type && (
                    <svg className="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 