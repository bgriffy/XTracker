'use client';

import { useState, useRef, useEffect } from 'react';
import { WorkoutSessionExercise } from '@/types/workout';
import { ExerciseSetInput } from '@/components/workouts/ExerciseSetInput';

interface WorkoutExerciseProps {
  exercise: WorkoutSessionExercise;
  onUpdate: (exercise: WorkoutSessionExercise) => void;
  onHide: () => void;
}

export function WorkoutExercise({ exercise, onUpdate, onHide }: WorkoutExerciseProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(exercise.notes);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleSetUpdate = (setNumber: number, updatedSet: any) => {
    const updatedSets = exercise.sets.map(set => {
      if (set.setNumber === setNumber) {
        return { ...set, ...updatedSet };
      }
      return set;
    });

    const updatedExercise = {
      ...exercise,
      sets: updatedSets
    };

    onUpdate(updatedExercise);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    
    // Debounced save
    const timeoutId = setTimeout(() => {
      const updatedExercise = {
        ...exercise,
        notes: newNotes
      };
      onUpdate(updatedExercise);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const getCompletedSetsCount = () => {
    return exercise.sets.filter(set => set.isCompleted).length;
  };

  const getTotalSetsCount = () => {
    return exercise.sets.length;
  };

  const getLastSessionData = () => {
    if (!exercise.lastSessionData || exercise.lastSessionData.length === 0) {
      return null;
    }

    const lastSet = exercise.lastSessionData[exercise.lastSessionData.length - 1];
    return lastSet;
  };

  const lastSessionData = getLastSessionData();

  return (
    <div id={`exercise-${exercise.id}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
      {/* Exercise Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            {exercise.exerciseName}
          </h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              exercise.sets[0]?.isCompleted 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
            }`}>
              {exercise.sets[0]?.isCompleted ? '✓ Completed' : '○ Pending'}
            </span>
            {lastSessionData && (
              <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-200">
                Previous: {lastSessionData.reps ? `${lastSessionData.reps} reps` : ''}
                {lastSessionData.weight ? ` @ ${lastSessionData.weight}lbs` : ''}
                {lastSessionData.duration ? ` (${Math.floor(lastSessionData.duration / 60)}:${(lastSessionData.duration % 60).toString().padStart(2, '0')})` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Exercise Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Exercise menu"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowNotes(!showNotes);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {showNotes ? 'Hide Notes' : 'Show Notes'}
                </button>
                <button
                  onClick={() => {
                    onHide();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Hide Exercise
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Notes */}
      {showNotes && (
        <div className="mb-4">
          {/* Notes Header with Hide Button */}
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Exercise Notes
            </h5>
            <button
              onClick={() => setShowNotes(false)}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Hide notes"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Hide</span>
            </button>
          </div>

          <div className="space-y-2">
            {exercise.lastSessionData && exercise.lastSessionData.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Session Notes
                </label>
                <div className="bg-gray-100 dark:bg-gray-600 rounded p-2 text-sm text-gray-600 dark:text-gray-400">
                  {exercise.notes || 'No notes from last session'}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Session Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add notes about this exercise..."
                className="w-full h-20 px-3 py-2 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sets */}
      <div className="space-y-3">
        {exercise.sets.map((set) => (
          <ExerciseSetInput
            key={set.setNumber}
            set={set}
            exerciseType={exercise.exerciseType}
            lastSessionSet={exercise.lastSessionData?.[set.setNumber - 1]}
            onUpdate={(updatedSet) => handleSetUpdate(set.setNumber, updatedSet)}
          />
        ))}
      </div>
    </div>
  );
}
