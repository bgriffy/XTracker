'use client';

import { useState, useRef, useEffect } from 'react';
import { WorkoutRound as WorkoutRoundType, WorkoutSessionExercise } from '@/types/workout';
import { WorkoutExercise } from '@/components/workouts/WorkoutExercise';

interface WorkoutRoundProps {
  round: WorkoutRoundType;
  onUpdateExercises: (exercises: WorkoutSessionExercise[]) => void;
  onUpdateRoundName?: (roundId: string, newName: string) => void;
  onAddExercise?: (roundId: string) => void;
}

export function WorkoutRound({ round, onUpdateExercises, onUpdateRoundName, onAddExercise }: WorkoutRoundProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(round.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleExerciseUpdate = (exerciseId: string, updatedExercise: WorkoutSessionExercise) => {
    const updatedExercises = round.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return updatedExercise;
      }
      return exercise;
    });
    onUpdateExercises(updatedExercises);
  };

  const handleExerciseHide = (exerciseId: string) => {
    const updatedExercises = round.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          isHidden: !exercise.isHidden
        };
      }
      return exercise;
    });
    onUpdateExercises(updatedExercises);
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setShowMenu(false);
  };

  const handleSaveName = () => {
    if (onUpdateRoundName && editedName.trim()) {
      onUpdateRoundName(round.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(round.name);
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleUnhideExercises = () => {
    const updatedExercises = round.exercises.map(exercise => ({
      ...exercise,
      isHidden: false
    }));
    onUpdateExercises(updatedExercises);
    setShowMenu(false);
  };

  const handleAddExercise = () => {
    if (onAddExercise) {
      onAddExercise(round.id);
    }
    setShowMenu(false);
  };

  const visibleExercises = round.exercises.filter(exercise => !exercise.isHidden);
  const hiddenExercisesCount = round.exercises.filter(exercise => exercise.isHidden).length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
      {/* Round Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={isExpanded ? 'Collapse round' : 'Expand round'}
            >
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isEditingName ? (
              <input
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyPress}
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {round.name}
              </h3>
            )}
            
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              ({visibleExercises.length} exercises)
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {visibleExercises.filter(ex => ex.sets[0]?.isCompleted).length}/{visibleExercises.length} completed
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {hiddenExercisesCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {hiddenExercisesCount} hidden
              </span>
            )}
            
            {/* Three-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Round menu"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-2">
                    <button
                      onClick={handleAddExercise}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Add Exercise
                    </button>
                    <button
                      onClick={handleEditName}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>
                    {hiddenExercisesCount > 0 && (
                      <button
                        onClick={handleUnhideExercises}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Unhide exercises ({hiddenExercisesCount})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Round Content */}
      {isExpanded && (
        <div className="p-6">
          {visibleExercises.length > 0 ? (
            <div className="space-y-4">
              {visibleExercises.map((exercise) => (
                <WorkoutExercise
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={(updatedExercise: WorkoutSessionExercise) => handleExerciseUpdate(exercise.id, updatedExercise)}
                  onHide={() => handleExerciseHide(exercise.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No visible exercises in this round</p>
              <p className="text-sm mt-1">Use the session menu to add exercises or manage hidden exercises</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
