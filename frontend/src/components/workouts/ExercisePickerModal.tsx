'use client';

import { useState, useEffect } from 'react';

interface Exercise {
  id: string;
  name: string;
  type: 'Reps/Weight' | 'Time' | 'Reps-only' | 'Hybrid';
  description?: string;
  equipment?: string[];
}

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

// Mock predefined exercises (in real app, this would come from the Exercises library)
const PREDEFINED_EXERCISES: Exercise[] = [
  { id: 'ex-1', name: 'Push-ups', type: 'Reps-only', description: 'Standard push-up exercise', equipment: ['Bodyweight'] },
  { id: 'ex-2', name: 'Pull-ups', type: 'Reps-only', description: 'Pull-up exercise', equipment: ['Pull-up bar'] },
  { id: 'ex-3', name: 'Diamond Push-ups', type: 'Reps-only', description: 'Push-ups with hands in diamond position', equipment: ['Bodyweight'] },
  { id: 'ex-4', name: 'Lawn-mowers', type: 'Reps/Weight', description: 'Dumbbell lawn-mower exercise', equipment: ['Dumbbells'] },
  { id: 'ex-5', name: 'Military Press', type: 'Reps/Weight', description: 'Overhead press with dumbbells', equipment: ['Dumbbells'] },
  { id: 'ex-6', name: 'Plank', type: 'Time', description: 'Hold plank position', equipment: ['Bodyweight'] },
  { id: 'ex-7', name: 'Burpees', type: 'Hybrid', description: 'Full body exercise with reps and time', equipment: ['Bodyweight'] },
  { id: 'ex-8', name: 'Squats', type: 'Reps-only', description: 'Bodyweight squats', equipment: ['Bodyweight'] },
  { id: 'ex-9', name: 'Lunges', type: 'Reps-only', description: 'Alternating lunges', equipment: ['Bodyweight'] },
  { id: 'ex-10', name: 'Bench Press', type: 'Reps/Weight', description: 'Barbell bench press', equipment: ['Barbell', 'Bench'] },
];

export function ExercisePickerModal({ isOpen, onClose, onSelectExercise }: ExercisePickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(PREDEFINED_EXERCISES);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredExercises(PREDEFINED_EXERCISES);
    } else {
      const filtered = PREDEFINED_EXERCISES.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.equipment?.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredExercises(filtered);
    }
  }, [searchTerm]);

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    onClose();
  };

  const getTypeColor = (type: Exercise['type']) => {
    switch (type) {
      case 'Reps/Weight': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Reps-only': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Hybrid': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add Exercise
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No exercises found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleSelectExercise(exercise)}
                  className="w-full p-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {exercise.name}
                      </h3>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {exercise.description}
                        </p>
                      )}
                      {exercise.equipment && exercise.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exercise.equipment.map((eq, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                            >
                              {eq}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}>
                      {exercise.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
