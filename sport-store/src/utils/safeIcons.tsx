import React from 'react';
import { ArrowRight, FileText, DollarSign, Users, Package, Percent, Coins, Calendar, ShoppingCart, Loader2, ArrowLeft, Edit, Trash2, Power, Tag, Clock } from 'lucide-react';

// Safe icon exports với error handling
export const SafeIcons = {
  ArrowRight: (props: any) => {
    try {
      return <ArrowRight {...props} />;
    } catch (error) {
      console.warn('ArrowRight icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  FileText: (props: any) => {
    try {
      return <FileText {...props} />;
    } catch (error) {
      console.warn('FileText icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  DollarSign: (props: any) => {
    try {
      return <DollarSign {...props} />;
    } catch (error) {
      console.warn('DollarSign icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Users: (props: any) => {
    try {
      return <Users {...props} />;
    } catch (error) {
      console.warn('Users icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Package: (props: any) => {
    try {
      return <Package {...props} />;
    } catch (error) {
      console.warn('Package icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Percent: (props: any) => {
    try {
      return <Percent {...props} />;
    } catch (error) {
      console.warn('Percent icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Coins: (props: any) => {
    try {
      return <Coins {...props} />;
    } catch (error) {
      console.warn('Coins icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Calendar: (props: any) => {
    try {
      return <Calendar {...props} />;
    } catch (error) {
      console.warn('Calendar icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  ShoppingCart: (props: any) => {
    try {
      return <ShoppingCart {...props} />;
    } catch (error) {
      console.warn('ShoppingCart icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Loader2: (props: any) => {
    try {
      return <Loader2 {...props} />;
    } catch (error) {
      console.warn('Loader2 icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  ArrowLeft: (props: any) => {
    try {
      return <ArrowLeft {...props} />;
    } catch (error) {
      console.warn('ArrowLeft icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Edit: (props: any) => {
    try {
      return <Edit {...props} />;
    } catch (error) {
      console.warn('Edit icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Trash2: (props: any) => {
    try {
      return <Trash2 {...props} />;
    } catch (error) {
      console.warn('Trash2 icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Power: (props: any) => {
    try {
      return <Power {...props} />;
    } catch (error) {
      console.warn('Power icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Tag: (props: any) => {
    try {
      return <Tag {...props} />;
    } catch (error) {
      console.warn('Tag icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
  Clock: (props: any) => {
    try {
      return <Clock {...props} />;
    } catch (error) {
      console.warn('Clock icon failed to load:', error);
      return <IconFallback {...props} />;
    }
  },
};

// Fallback component
const IconFallback = ({ className = "w-6 h-6", size, ...props }: any) => (
  <div 
    className={`${className} bg-gray-200 rounded animate-pulse`} 
    style={{ width: size, height: size }}
    {...props}
  />
); 