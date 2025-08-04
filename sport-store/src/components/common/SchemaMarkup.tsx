'use client';

import Script from 'next/script';

interface SchemaMarkupProps {
  type: 'Organization' | 'WebSite' | 'Product' | 'BreadcrumbList';
  data: any;
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const getSchemaData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Khánh Hoàn Shop',
          url: 'https://www.vjusport.com',
          logo: 'https://www.vjusport.com/Logo_vju.png',
          description: 'Cửa hàng thể thao Khánh Hoàn Shop - Chuyên cung cấp các sản phẩm thể thao chất lượng cao',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Phạm Văn Đồng, Cầu Giấy',
            addressLocality: 'Hà Nội',
            addressRegion: 'Hà Nội',
            postalCode: '100000',
            addressCountry: 'VN'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+84-xxx-xxx-xxxx',
            contactType: 'customer service',
            email: 'contact@vjusport.com'
          },
          sameAs: [
            'https://www.facebook.com/vjusport',
            'https://www.instagram.com/vjusport'
          ]
        };
      
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Khánh Hoàn Shop',
          url: 'https://www.vjusport.com',
          description: 'Cửa hàng thể thao Khánh Hoàn Shop - Chuyên cung cấp các sản phẩm thể thao chất lượng cao',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.vjusport.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };
      
      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name || 'Sản phẩm thể thao',
          description: data.description || 'Sản phẩm thể thao chất lượng cao',
          brand: {
            '@type': 'Brand',
            name: data.brand || 'Khánh Hoàn Shop'
          },
          category: data.category || 'Thể thao',
          image: data.image || 'https://www.vjusport.com/default-image.png',
          offers: {
            '@type': 'Offer',
            price: data.price || 0,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'Khánh Hoàn Shop'
            }
          }
        };
      
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items || []
        };
      
      default:
        return {};
    }
  };

  return (
    <Script
      id={`schema-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchemaData())
      }}
    />
  );
} 