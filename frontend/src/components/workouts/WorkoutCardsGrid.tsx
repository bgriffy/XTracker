'use client';

import { WorkoutCard } from '@/types/workout';
import { WorkoutCardComponent } from './WorkoutCardComponent';

interface WorkoutCardsGridProps {
  workoutCards: WorkoutCard[];
  onLogWorkout: (workoutCard: WorkoutCard) => void;
  onViewHistory: (workoutCard: WorkoutCard) => void;
  onEditTemplate: (workoutCard: WorkoutCard) => void;
  onRemoveCard: (workoutCard: WorkoutCard) => void;
}

export function WorkoutCardsGrid({
  workoutCards,
  onLogWorkout,
  onViewHistory,
  onEditTemplate,
  onRemoveCard,
}: WorkoutCardsGridProps) {
  if (workoutCards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {workoutCards.map((card) => (
        <WorkoutCardComponent
          key={card.id}
          workoutCard={card}
          onLogWorkout={onLogWorkout}
          onViewHistory={onViewHistory}
          onEditTemplate={onEditTemplate}
          onRemoveCard={onRemoveCard}
        />
      ))}
    </div>
  );
}
