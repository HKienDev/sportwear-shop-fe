/**
 * Utility function để xử lý URL backend một cách nhất quán
 */

export function getBackendUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  // Remove /api if it's already in the baseUrl to avoid duplicate
  const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
  
  // Ensure endpoint starts with /api
  const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
  
  return `${cleanBaseUrl}${cleanEndpoint}`;
}

export function getBackendBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
}
