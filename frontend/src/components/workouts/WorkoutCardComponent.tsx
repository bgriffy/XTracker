'use client';

import { useState, useEffect, useRef } from 'react';
import { WorkoutCard } from '@/types/workout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface WorkoutCardComponentProps {
  workoutCard: WorkoutCard;
  onLogWorkout: (workoutCard: WorkoutCard) => void;
  onViewHistory: (workoutCard: WorkoutCard) => void;
  onEditTemplate: (workoutCard: WorkoutCard) => void;
  onRemoveCard: (workoutCard: WorkoutCard) => void;
}

export function WorkoutCardComponent({
  workoutCard,
  onLogWorkout,
  onViewHistory,
  onEditTemplate,
  onRemoveCard,
}: WorkoutCardComponentProps) {
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'resistance':
        return '🏋️';
      case 'cardio':
        return '🏃';
      case 'flexibility':
        return '🧘';
      case 'plyometrics':
        return '⚡';
      case 'martial arts':
        return '🥋';
      case 'core':
        return '💪';
      default:
        return '🏃‍♂️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'resistance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cardio':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'flexibility':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'plyometrics':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'martial arts':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'core':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatLastWorkout = (date?: string) => {
    if (!date) return 'Never';
    const workoutDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - workoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 relative">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{getCategoryIcon(workoutCard.category)}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {workoutCard.templateName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(workoutCard.category)}`}>
                  {workoutCard.category}
                </span>
              </div>
            </div>
          </div>
          
          {/* Card Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => handleMenuAction(() => onViewHistory(workoutCard))}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    History
                  </button>
                  <button
                    onClick={() => handleMenuAction(() => onEditTemplate(workoutCard))}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Edit Template
                  </button>
                  <button
                    onClick={() => handleMenuAction(() => onRemoveCard(workoutCard))}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
          {workoutCard.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">⏱️</span>
            <span className="text-gray-700 dark:text-gray-300">{formatDuration(workoutCard.estimatedDurationMinutes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📅</span>
            <span className="text-gray-700 dark:text-gray-300">{formatLastWorkout(workoutCard.lastWorkoutDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">🏆</span>
            <span className="text-gray-700 dark:text-gray-300">{workoutCard.completionCount} times</span>
          </div>
        </div>

        {/* Equipment */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-500 text-sm">🏋️</span>
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Equipment:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {workoutCard.equipment.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-auto">
          <Button
            onClick={() => onLogWorkout(workoutCard)}
            className="w-full"
            size="sm"
          >
            Log Workout
          </Button>
        </div>
      </div>
    </Card>
  );
}
