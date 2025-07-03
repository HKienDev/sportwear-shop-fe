'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugCartPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCartAPI = async () => {
    try {
      setLoading(true);
      setResult(null);

      // Lấy token từ localStorage
      const token = localStorage.getItem('accessToken');
      console.log('🔑 Token:', token);

      if (!token) {
        setResult({ error: 'No token found' });
        return;
      }

      // Test cart API
      const response = await fetch('/api/cart/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('📡 Test response:', data);
      setResult(data);
    } catch (error) {
      console.error('❌ Test error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testRemoveAPI = async () => {
    try {
      setLoading(true);
      setResult(null);

      // Lấy token từ localStorage
      const token = localStorage.getItem('accessToken');
      console.log('🔑 Token:', token);

      if (!token) {
        setResult({ error: 'No token found' });
        return;
      }

      // Test remove API
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sku: 'test-sku',
          color: 'red',
          size: 'M'
        })
      });

      const data = await response.json();
      console.log('📡 Remove response:', data);
      setResult(data);
    } catch (error) {
      console.error('❌ Remove test error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Cart API</h1>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Cart API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testCartAPI} disabled={loading}>
              {loading ? 'Testing...' : 'Test Cart API'}
            </Button>
            
            <Button onClick={testRemoveAPI} disabled={loading}>
              {loading ? 'Testing...' : 'Test Remove API'}
            </Button>
            
            {result && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 