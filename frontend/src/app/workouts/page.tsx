'use client';

import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { WorkoutsPage } from '@/components/workouts/WorkoutsPage';

export default function WorkoutsPageRoute() {
  const router = useRouter();

  const handleLogWorkout = (workoutCard: any) => {
    // TODO: Implement workout logging logic
    console.log('Logging workout:', workoutCard);
    router.push(`/workouts/${workoutCard.templateId}`);
  };

  const handleViewHistory = (workoutCard: any) => {
    // TODO: Implement workout history view
    console.log('Viewing history for:', workoutCard);
    router.push(`/workouts/history?template=${workoutCard.templateId}`);
  };

  const handleEditTemplate = (workoutCard: any) => {
    // TODO: Implement template editing
    console.log('Editing template:', workoutCard);
    router.push(`/templates/${workoutCard.templateId}`);
  };

  const handleRemoveCard = (workoutCard: any) => {
    // TODO: Implement card removal
    console.log('Removing card:', workoutCard);
  };

  const handleAddWorkout = () => {
    // TODO: Implement add workout modal
    console.log('Opening add workout modal');
  };

  return (
    <MainLayout showHeader={false} showFooter={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WorkoutsPage
            onLogWorkout={handleLogWorkout}
            onViewHistory={handleViewHistory}
            onEditTemplate={handleEditTemplate}
            onRemoveCard={handleRemoveCard}
            onAddWorkout={handleAddWorkout}
          />
        </div>
      </div>
    </MainLayout>
  );
}
