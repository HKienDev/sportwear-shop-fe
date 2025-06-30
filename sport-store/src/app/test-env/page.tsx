'use client';

import { useEffect } from 'react';

export default function TestEnvPage() {
  useEffect(() => {
    console.log('🔍 Test Environment Variables:');
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All NEXT_PUBLIC_ vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'undefined'}</p>
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</p>
        <p><strong>All NEXT_PUBLIC_ vars:</strong></p>
        <ul className="list-disc list-inside">
          {Object.keys(process.env)
            .filter(key => key.startsWith('NEXT_PUBLIC_'))
            .map(key => (
              <li key={key}>{key}: {process.env[key]}</li>
            ))}
        </ul>
      </div>
    </div>
  );
} 