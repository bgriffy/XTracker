'use client';

import { useState } from 'react';
import { WorkoutSession, WorkoutSessionExercise } from '@/types/workout';
import { WorkoutRound } from '@/components/workouts/WorkoutRound';
import { ExercisePickerModal } from '@/components/workouts/ExercisePickerModal';

interface WorkoutDetailsBodyProps {
  session: WorkoutSession;
  onUpdateSession: (session: WorkoutSession) => void;
}

export function WorkoutDetailsBody({
  session,
  onUpdateSession
}: WorkoutDetailsBodyProps) {
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const handleRoundUpdate = (updatedRounds: WorkoutSession['rounds']) => {
    const updatedSession = {
      ...session,
      rounds: updatedRounds
    };
    onUpdateSession(updatedSession);
  };

  const handleExerciseUpdate = (roundId: string, updatedExercises: WorkoutSession['rounds'][0]['exercises']) => {
    const updatedRounds = session.rounds.map(round => {
      if (round.id === roundId) {
        return {
          ...round,
          exercises: updatedExercises
        };
      }
      return round;
    });

    handleRoundUpdate(updatedRounds);
  };

  const handleRoundNameUpdate = (roundId: string, newName: string) => {
    const updatedRounds = session.rounds.map(round => {
      if (round.id === roundId) {
        return {
          ...round,
          name: newName
        };
      }
      return round;
    });

    handleRoundUpdate(updatedRounds);
  };

  const handleAddExercise = (roundId: string) => {
    setSelectedRoundId(roundId);
    setShowExercisePicker(true);
  };

  const handleSelectExercise = (exercise: any) => {
    if (!selectedRoundId) return;

    const newExercise: WorkoutSessionExercise = {
      id: `exercise-${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseType: exercise.type,
      order: session.rounds.find(r => r.id === selectedRoundId)?.exercises.length || 0,
      isHidden: false,
      sets: [
        { setNumber: 1, reps: 0, isCompleted: false }
      ],
      notes: '',
      lastSessionData: []
    };

    const updatedRounds = session.rounds.map(round => {
      if (round.id === selectedRoundId) {
        return {
          ...round,
          exercises: [...round.exercises, newExercise]
        };
      }
      return round;
    });

    handleRoundUpdate(updatedRounds);
    
    // Auto-scroll to the new exercise after a short delay
    setTimeout(() => {
      const newExerciseElement = document.getElementById(`exercise-${newExercise.id}`);
      if (newExerciseElement) {
        newExerciseElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleCloseExercisePicker = () => {
    setShowExercisePicker(false);
    setSelectedRoundId(null);
  };

  return (
    <>
      <div className="space-y-6">
        {session.rounds.map((round) => (
          <WorkoutRound
            key={round.id}
            round={round}
            onUpdateExercises={(exercises) => handleExerciseUpdate(round.id, exercises)}
            onUpdateRoundName={handleRoundNameUpdate}
            onAddExercise={handleAddExercise}
          />
        ))}
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        isOpen={showExercisePicker}
        onClose={handleCloseExercisePicker}
        onSelectExercise={handleSelectExercise}
      />
    </>
  );
}
