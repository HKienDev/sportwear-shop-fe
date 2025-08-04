'use client';

import Head from 'next/head';
import SchemaMarkup from './SchemaMarkup';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  productData?: any;
  breadcrumbData?: any;
}

export default function SEOHead({
  title = 'Khánh Hoàn Shop - Cửa Hàng Thể Thao Chất Lượng Cao',
  description = 'Khánh Hoàn Shop - Cửa hàng thể thao chuyên cung cấp các sản phẩm thể thao chất lượng cao, giày thể thao, quần áo thể thao, phụ kiện thể thao.',
  keywords = 'thể thao, giày thể thao, quần áo thể thao, phụ kiện thể thao, Khánh Hoàn Shop',
  image = '/Logo_vju.png',
  url = 'https://www.vjusport.com',
  type = 'website',
  productData,
  breadcrumbData
}: SEOHeadProps) {
  const fullUrl = `${url}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Khánh Hoàn Shop" />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Khánh Hoàn Shop" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Schema.org Markup */}
      {productData && <SchemaMarkup type="Product" data={productData} />}
      {breadcrumbData && <SchemaMarkup type="BreadcrumbList" data={breadcrumbData} />}
    </Head>
  );
} 