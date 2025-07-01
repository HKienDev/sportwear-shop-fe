import React from 'react';
import { ArrowRight, FileText, DollarSign, Users, Package, Percent, Coins, Calendar, ShoppingCart, Loader2, ArrowLeft, Edit, Trash2, Power, Tag, Clock, Search, ShoppingBag } from 'lucide-react';

// Common props type for all icons
type IconProps = {
  className?: string;
  size?: string | number;
  color?: string;
  [key: string]: unknown;
};

// Safe icon exports với error handling
export const SafeIcons = {
  ArrowRight: (props: IconProps) => {
    try {
      return <ArrowRight {...props} />;
    } catch (error) {
      console.warn('ArrowRight icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  FileText: (props: React.ComponentProps<typeof FileText>) => {
    try {
      return <FileText {...props} />;
    } catch (error) {
      console.warn('FileText icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  DollarSign: (props: React.ComponentProps<typeof DollarSign>) => {
    try {
      return <DollarSign {...props} />;
    } catch (error) {
      console.warn('DollarSign icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Users: (props: React.ComponentProps<typeof Users>) => {
    try {
      return <Users {...props} />;
    } catch (error) {
      console.warn('Users icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Package: (props: React.ComponentProps<typeof Package>) => {
    try {
      return <Package {...props} />;
    } catch (error) {
      console.warn('Package icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Percent: (props: React.ComponentProps<typeof Percent>) => {
    try {
      return <Percent {...props} />;
    } catch (error) {
      console.warn('Percent icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Coins: (props: React.ComponentProps<typeof Coins>) => {
    try {
      return <Coins {...props} />;
    } catch (error) {
      console.warn('Coins icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Calendar: (props: React.ComponentProps<typeof Calendar>) => {
    try {
      return <Calendar {...props} />;
    } catch (error) {
      console.warn('Calendar icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  ShoppingCart: (props: React.ComponentProps<typeof ShoppingCart>) => {
    try {
      return <ShoppingCart {...props} />;
    } catch (error) {
      console.warn('ShoppingCart icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Loader2: (props: React.ComponentProps<typeof Loader2>) => {
    try {
      return <Loader2 {...props} />;
    } catch (error) {
      console.warn('Loader2 icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  ArrowLeft: (props: React.ComponentProps<typeof ArrowLeft>) => {
    try {
      return <ArrowLeft {...props} />;
    } catch (error) {
      console.warn('ArrowLeft icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Edit: (props: React.ComponentProps<typeof Edit>) => {
    try {
      return <Edit {...props} />;
    } catch (error) {
      console.warn('Edit icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Trash2: (props: React.ComponentProps<typeof Trash2>) => {
    try {
      return <Trash2 {...props} />;
    } catch (error) {
      console.warn('Trash2 icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Power: (props: React.ComponentProps<typeof Power>) => {
    try {
      return <Power {...props} />;
    } catch (error) {
      console.warn('Power icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Tag: (props: React.ComponentProps<typeof Tag>) => {
    try {
      return <Tag {...props} />;
    } catch (error) {
      console.warn('Tag icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Clock: (props: React.ComponentProps<typeof Clock>) => {
    try {
      return <Clock {...props} />;
    } catch (error) {
      console.warn('Clock icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Search: (props: React.ComponentProps<typeof Search>) => {
    try {
      return <Search {...props} />;
    } catch (error) {
      console.warn('Search icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  ShoppingBag: (props: React.ComponentProps<typeof ShoppingBag>) => {
    try {
      return <ShoppingBag {...props} />;
    } catch (error) {
      console.warn('ShoppingBag icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
};

// Fallback component
const IconFallback = ({ className = "w-6 h-6", size }: IconProps) => (
  <div 
    className={`${className} bg-gray-200 rounded animate-pulse`} 
    style={{ width: size, height: size }}
  />
); 