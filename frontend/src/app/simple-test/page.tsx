'use client';

import { useState } from 'react';

export default function SimpleTestPage() {
  const [result, setResult] = useState<string>('Click the button to test API');

  const testAPI = async () => {
    try {
      setResult('Testing API...');
      const response = await fetch('http://localhost:5272/api/workouts');
      const data = await response.json();
      setResult(`✅ Success! Found ${data.workouts.length} workouts`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Simple API Test</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-md mb-6">
        <button 
          onClick={testAPI}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test API Connection
        </button>
        <p className="mt-4 text-lg">{result}</p>
      </div>

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
