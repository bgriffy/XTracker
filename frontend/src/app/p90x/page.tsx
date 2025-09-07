'use client';

import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { P90XWorkoutList } from '@/components/workouts/P90XWorkoutList';
import { WorkoutTemplate } from '@/lib/api/workoutService';

export default function P90XPage() {
  const router = useRouter();

  const handleStartWorkout = (template: WorkoutTemplate) => {
    // TODO: Implement workout starting logic
    console.log('Starting workout:', template);
    alert(`Starting ${template.name} workout! (Feature coming soon)`);
  };

  const handleViewDetails = (template: WorkoutTemplate) => {
    router.push(`/workouts/${template.id}`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <P90XWorkoutList
            onStartWorkout={handleStartWorkout}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </MainLayout>
  );
}
