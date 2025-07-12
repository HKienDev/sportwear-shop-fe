import { useEffect, useState } from 'react';

export function useLucideIcon(iconName: string) {
  const [Icon, setIcon] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        // Dynamic import để tránh HMR issues
        const lucideReact = await import('lucide-react');
        const iconComponent = (lucideReact as unknown as { [key: string]: unknown })[iconName];
        
        if (iconComponent) {
          setIcon(() => iconComponent);
          setError(null);
        } else {
          setError(`Icon ${iconName} not found`);
        }
      } catch (err) {
        console.error(`Error loading icon ${iconName}:`, err);
        setError(`Failed to load icon ${iconName}`);
      }
    };

    loadIcon();
  }, [iconName]);

  return { Icon, error };
}

// Pre-import common icons để tránh HMR issues
export const preloadCommonIcons = async () => {
  try {
    await import('lucide-react');
  } catch (error) {
    console.error('Failed to preload lucide-react icons:', error);
  }
}; 