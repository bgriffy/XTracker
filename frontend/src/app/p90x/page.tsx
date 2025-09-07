'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function P90XRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new workouts page
    router.replace('/workouts');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to workouts...</p>
      </div>
    </div>
  );
}