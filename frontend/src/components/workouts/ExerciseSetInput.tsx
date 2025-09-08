'use client';

import { useState, useEffect } from 'react';
import { ExerciseSet } from '@/types/workout';

interface ExerciseSetInputProps {
  set: ExerciseSet;
  exerciseType: 'Reps/Weight' | 'Time' | 'Reps-only' | 'Hybrid';
  lastSessionSet?: ExerciseSet;
  onUpdate: (set: ExerciseSet) => void;
}

export function ExerciseSetInput({ set, exerciseType, lastSessionSet, onUpdate }: ExerciseSetInputProps) {
  const [reps, setReps] = useState(set.reps?.toString() || '');
  const [weight, setWeight] = useState(set.weight?.toString() || '');
  const [duration, setDuration] = useState(set.duration?.toString() || '');
  const [isCompleted, setIsCompleted] = useState(set.isCompleted);

  // Update local state when set prop changes
  useEffect(() => {
    setReps(set.reps?.toString() || '');
    setWeight(set.weight?.toString() || '');
    setDuration(set.duration?.toString() || '');
    setIsCompleted(set.isCompleted);
  }, [set]);

  const handleRepsChange = (value: string) => {
    setReps(value);
    const numValue = value === '' ? undefined : parseInt(value);
    onUpdate({
      ...set,
      reps: numValue
    });
  };

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numValue = value === '' ? undefined : parseFloat(value);
    onUpdate({
      ...set,
      weight: numValue
    });
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    const numValue = value === '' ? undefined : parseInt(value);
    onUpdate({
      ...set,
      duration: numValue
    });
  };

  const handleCompletionToggle = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    onUpdate({
      ...set,
      isCompleted: newCompleted
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const parseDurationInput = (input: string) => {
    // Handle mm:ss format
    if (input.includes(':')) {
      const [minutes, seconds] = input.split(':').map(Number);
      return (minutes * 60) + (seconds || 0);
    }
    // Handle seconds only
    return parseInt(input) || 0;
  };

  const getLastSessionDisplay = () => {
    if (!lastSessionSet) return null;

    const parts = [];
    if (lastSessionSet.reps) parts.push(`${lastSessionSet.reps} reps`);
    if (lastSessionSet.weight) parts.push(`@ ${lastSessionSet.weight}lbs`);
    if (lastSessionSet.duration) parts.push(`(${formatDuration(lastSessionSet.duration)})`);

    return parts.length > 0 ? parts.join(' ') : null;
  };

  const lastSessionDisplay = getLastSessionDisplay();

  return (
    <div className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-colors ${
      isCompleted 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600' 
        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500'
    }`}>
      {/* Completion Checkbox */}
      <div className="flex items-center">
        <button
          onClick={handleCompletionToggle}
          className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted
              ? 'bg-green-500 border-green-500 text-white shadow-md'
              : 'border-gray-400 dark:border-gray-400 bg-white dark:bg-gray-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
          aria-label={`Mark as ${isCompleted ? 'incomplete' : 'complete'}`}
        >
          {isCompleted && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Input Fields */}
      <div className="flex-1 flex items-center space-x-4">
        {/* Reps Input */}
        {(exerciseType === 'Reps/Weight' || exerciseType === 'Reps-only' || exerciseType === 'Hybrid') && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">Reps:</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => handleRepsChange(e.target.value)}
              className="w-20 px-3 py-2 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0"
              min="0"
            />
          </div>
        )}

        {/* Weight Input */}
        {(exerciseType === 'Reps/Weight' || exerciseType === 'Hybrid') && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">Weight:</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className="w-20 px-3 py-2 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0"
              min="0"
              step="0.5"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">lbs</span>
          </div>
        )}

        {/* Duration Input */}
        {(exerciseType === 'Time' || exerciseType === 'Hybrid') && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12">Time:</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => {
                const value = e.target.value;
                setDuration(value);
                const seconds = parseDurationInput(value);
                onUpdate({
                  ...set,
                  duration: seconds
                });
              }}
              className="w-24 px-3 py-2 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0:00"
            />
          </div>
        )}
      </div>

    </div>
  );
}
