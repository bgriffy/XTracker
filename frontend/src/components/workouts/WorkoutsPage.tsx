'use client';

import { useState, useEffect } from 'react';
import { WorkoutCard } from '@/types/workout';
import { useWorkoutCards, useWorkoutCardsActions } from '@/contexts/WorkoutCardsContext';
import { workoutCardsService } from '@/lib/mockData/workoutCardsService';
import { WorkoutCardsGrid } from './WorkoutCardsGrid';
import { AddWorkoutModal } from './AddWorkoutModal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';

interface WorkoutsPageProps {
  onLogWorkout: (workoutCard: WorkoutCard) => void;
  onViewHistory: (workoutCard: WorkoutCard) => void;
  onEditTemplate: (workoutCard: WorkoutCard) => void;
  onRemoveCard: (workoutCard: WorkoutCard) => void;
  onAddWorkout: () => void;
}

export function WorkoutsPage({
  onLogWorkout,
  onViewHistory,
  onEditTemplate,
  onRemoveCard,
  onAddWorkout,
}: WorkoutsPageProps) {
  const { state } = useWorkoutCards();
  const { setLoading, setError, setWorkoutCards } = useWorkoutCardsActions();
  const [showAddModal, setShowAddModal] = useState(false);

  // Load workout cards on component mount
  useEffect(() => {
    const loadWorkoutCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const cards = await workoutCardsService.getWorkoutCards();
        setWorkoutCards(cards);
      } catch (err) {
        console.error('Failed to load workout cards:', err);
        setError('Failed to load workout cards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutCards();
  }, []); // Empty dependency array - only run on mount

  const handleAddWorkout = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleAddWorkoutCard = async (templateId: string) => {
    try {
      setLoading(true);
      const newCard = await workoutCardsService.addWorkoutCard(templateId);
      setWorkoutCards([...state.workoutCards, newCard]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add workout card:', err);
      setError('Failed to add workout card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.loading && state.workoutCards.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Loading your workouts...</span>
        </div>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{state.error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Workouts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to push your limits? Choose your workout below and get ready to bring it!
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleAddWorkout} className="w-full sm:w-auto">
            Add Workout
          </Button>
        </div>
      </div>

      {/* Workout Cards Grid */}
      {state.workoutCards.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your first workout to get started with tracking your fitness journey
            </p>
            <Button onClick={handleAddWorkout}>
              Add Your First Workout
            </Button>
          </div>
        </Card>
      ) : (
        <WorkoutCardsGrid
          workoutCards={state.workoutCards}
          onLogWorkout={onLogWorkout}
          onViewHistory={onViewHistory}
          onEditTemplate={onEditTemplate}
          onRemoveCard={onRemoveCard}
        />
      )}

      {/* Add Workout Modal */}
      {showAddModal && (
        <AddWorkoutModal
          onClose={handleCloseModal}
          onAddWorkout={handleAddWorkoutCard}
        />
      )}
    </div>
  );
}
