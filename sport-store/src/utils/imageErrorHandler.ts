/**
 * Utility function to handle image loading errors
 * Provides fallback icons when images fail to load
 */

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackIcon: 'shopping-bag' | 'package' | 'default' = 'default',
  size: 'sm' | 'md' | 'lg' = 'md'
) => {
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
  
  const parent = target.parentElement;
  if (!parent) return;

  // Size classes mapping
  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12',
    md: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18'
  };

  // Icon mapping
  const iconMap = {
    'shopping-bag': `<svg class="${sizeClasses[size]} text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
    </svg>`,
    'package': `<svg class="${sizeClasses[size]} text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
    </svg>`,
    'default': `<svg class="${sizeClasses[size]} text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
    </svg>`
  };

  const fallback = document.createElement('div');
  fallback.className = `${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-purple-100 to-red-100 rounded-full`;
  fallback.innerHTML = iconMap[fallbackIcon];
  
  parent.appendChild(fallback);
};

/**
 * Enhanced image error handler with custom styling
 */
export const handleImageErrorWithStyle = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  options: {
    icon?: 'shopping-bag' | 'package' | 'default';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    bgColor?: string;
    iconColor?: string;
  } = {}
) => {
  const {
    icon = 'default',
    size = 'md',
    className = '',
    bgColor = 'from-purple-100 to-red-100',
    iconColor = 'text-purple-600'
  } = options;

  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
  
  const parent = target.parentElement;
  if (!parent) return;

  const sizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12',
    md: 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18'
  };

  const iconMap = {
    'shopping-bag': `<svg class="${sizeClasses[size]} ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
    </svg>`,
    'package': `<svg class="${sizeClasses[size]} ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
    </svg>`,
    'default': `<svg class="${sizeClasses[size]} ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
    </svg>`
  };

  const fallback = document.createElement('div');
  fallback.className = `${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br ${bgColor} rounded-full ${className}`;
  fallback.innerHTML = iconMap[icon];
  
  parent.appendChild(fallback);
}; 