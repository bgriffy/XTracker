'use client';

import { useState } from 'react';
import { WorkoutSession } from '@/types/workout';
import Button from '@/components/ui/Button';

interface WorkoutFinishModalProps {
  session: WorkoutSession;
  onConfirm: (saveToTemplate: boolean) => Promise<void>;
  onCancel: () => void;
}

export function WorkoutFinishModal({ session, onConfirm, onCancel }: WorkoutFinishModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [saveToTemplate, setSaveToTemplate] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(saveToTemplate);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletedSetsCount = () => {
    return session.rounds.reduce((total, round) => {
      return total + round.exercises.reduce((roundTotal, exercise) => {
        return roundTotal + exercise.sets.filter(set => set.isCompleted).length;
      }, 0);
    }, 0);
  };

  const getTotalSetsCount = () => {
    return session.rounds.reduce((total, round) => {
      return total + round.exercises.reduce((roundTotal, exercise) => {
        return roundTotal + exercise.sets.length;
      }, 0);
    }, 0);
  };

  const getWorkoutDuration = () => {
    const start = new Date(session.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const completedSets = getCompletedSetsCount();
  const totalSets = getTotalSetsCount();
  const duration = getWorkoutDuration();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-600">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Finish Workout
          </h3>

          {/* Workout Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Workout Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Template:</span>
                <span className="text-gray-900 dark:text-gray-100">{session.templateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="text-gray-900 dark:text-gray-100">{duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sets Completed:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {completedSets}/{totalSets} ({Math.round((completedSets / totalSets) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Structural Changes Warning */}
          {session.hasStructuralChanges && (
            <div className="mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Structural Changes Detected
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      You've made changes to the workout structure (added/removed exercises, reordered rounds, etc.).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={saveToTemplate}
                    onChange={(e) => setSaveToTemplate(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Save changes to template
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Apply these structural changes to the template for future sessions
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Finishing...' : 'Finish Workout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
