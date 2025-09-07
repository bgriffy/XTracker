'use client';

import { useState, useEffect } from 'react';
import { workoutTemplateService, WorkoutTemplate } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { WorkoutTemplatesGrid } from './WorkoutTemplatesGrid';

interface P90XWorkoutListProps {
  onStartWorkout?: (template: WorkoutTemplate) => void;
  onViewDetails?: (template: WorkoutTemplate) => void;
}

export function P90XWorkoutList({ onStartWorkout, onViewDetails }: P90XWorkoutListProps) {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutTemplateService.getP90XWorkoutTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load P90X workout templates:', err);
      setError('Failed to load P90X workout templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);



  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Loading P90X workouts...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadTemplates} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          P90X Workout Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to push your limits? Choose your workout below and get ready to bring it! 💪
        </p>
      </div>


      {/* Workout Templates Grid */}
      <WorkoutTemplatesGrid
        templates={templates}
        onStartWorkout={onStartWorkout}
        onViewDetails={onViewDetails}
        hasFilters={false}
        searchTerm=""
        filterCategory=""
        filterDifficulty=""
      />

    </div>
  );
}
