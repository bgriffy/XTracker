'use client';

import { useState, useEffect } from 'react';
import { workoutService } from '@/lib/api/workoutService';

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [workouts, setWorkouts] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setApiStatus('Testing API connection...');
        
        // Test the API client base URL
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5272/api';
        setApiStatus(`API Base URL: ${baseURL}`);
        
        // Test the workouts endpoint
        const result = await workoutService.getWorkouts();
        setWorkouts(result);
        setApiStatus('✅ API connection successful!');
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setApiStatus('❌ API connection failed');
        console.error('API Error:', err);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">API Debug Page</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Status</h2>
        <p className="text-lg">{apiStatus}</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {workouts && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Workouts Data</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(workouts, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <a 
          href="/workouts" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ← Back to Workouts
        </a>
      </div>
    </div>
  );
}
