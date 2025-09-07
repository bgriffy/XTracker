'use client';

import { useState } from 'react';
import { workoutService, CreateWorkoutRequest, Workout } from '@/lib/api/workoutService';
import { WorkoutForm } from '@/components/forms/WorkoutForm';
import { WorkoutList } from '@/components/workouts/WorkoutList';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function WorkoutsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreateWorkout = async (data: CreateWorkoutRequest) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await workoutService.createWorkout(data);
      
      // Reset form and refresh list
      setShowForm(false);
      setEditingWorkout(null);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success message (you could add a toast notification here)
      console.log('Workout created successfully!');
    } catch (error) {
      console.error('Failed to create workout:', error);
      setSubmitError('Failed to create workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWorkout = async (data: CreateWorkoutRequest) => {
    if (!editingWorkout) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await workoutService.updateWorkout(editingWorkout.id, data);
      
      // Reset form and refresh list
      setShowForm(false);
      setEditingWorkout(null);
      setRefreshTrigger(prev => prev + 1);
      
      console.log('Workout updated successfully!');
    } catch (error) {
      console.error('Failed to update workout:', error);
      setSubmitError('Failed to update workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setShowForm(true);
  };

  const handleDeleteWorkout = (workoutId: number) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingWorkout(null);
    setSubmitError(null);
  };

  const getInitialFormData = (): Partial<CreateWorkoutRequest> | undefined => {
    if (!editingWorkout) return undefined;

    return {
      date: editingWorkout.date.split('T')[0], // Convert to date input format
      type: editingWorkout.type,
      durationMinutes: editingWorkout.durationMinutes,
      notes: editingWorkout.notes || '',
      reps: editingWorkout.reps || undefined,
      weight: editingWorkout.weight || undefined,
      exercises: editingWorkout.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || undefined,
        duration: ex.duration || undefined,
        notes: ex.notes || '',
      })),
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Workout Tracker</h1>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          Log your workouts and track your fitness progress
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Log New Workout
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleCancelForm}
              variant="outline"
            >
              Cancel
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
              {editingWorkout ? 'Editing workout' : 'Creating new workout'}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {submitError && (
        <Card className="p-4 mb-6 border-red-200 bg-red-50">
          <div className="flex items-center">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-red-800">{submitError}</p>
          </div>
        </Card>
      )}

      {/* Workout Form */}
      {showForm && (
        <div className="mb-8">
          <WorkoutForm
            onSubmit={editingWorkout ? handleUpdateWorkout : handleCreateWorkout}
            initialData={getInitialFormData()}
            isLoading={isSubmitting}
            submitButtonText={editingWorkout ? 'Update Workout' : 'Create Workout'}
          />
        </div>
      )}

      {/* Workout List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Workouts</h2>
        <WorkoutList
          onEditWorkout={handleEditWorkout}
          onDeleteWorkout={handleDeleteWorkout}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  );
}
