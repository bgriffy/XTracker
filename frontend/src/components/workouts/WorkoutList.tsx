'use client';

import { useState, useEffect } from 'react';
import { workoutService, Workout } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface WorkoutListProps {
  onEditWorkout?: (workout: Workout) => void;
  onDeleteWorkout?: (workoutId: number) => void;
  refreshTrigger?: number;
}

export function WorkoutList({ onEditWorkout, onDeleteWorkout, refreshTrigger }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutService.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      console.error('Failed to load workouts:', err);
      setError('Failed to load workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [refreshTrigger]);

  const handleDelete = async (workoutId: number) => {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await workoutService.deleteWorkout(workoutId);
      await loadWorkouts();
      onDeleteWorkout?.(workoutId);
    } catch (err) {
      console.error('Failed to delete workout:', err);
      setError('Failed to delete workout. Please try again.');
    }
  };

  const filteredAndSortedWorkouts = workouts
    .filter(workout => 
      filterType === '' || 
      workout.type.toLowerCase().includes(filterType.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'duration':
          comparison = a.durationMinutes - b.durationMinutes;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Loading workouts...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadWorkouts} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by type
              </label>
              <input
                type="text"
                id="filter-type"
                placeholder="e.g., Cardio, Strength"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort by
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'duration' | 'type')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="duration">Duration</option>
                <option value="type">Type</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <Button onClick={loadWorkouts} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </Card>

      {/* Workouts List */}
      {filteredAndSortedWorkouts.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No workouts found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {filterType ? 'Try adjusting your filters' : 'Start by logging your first workout!'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedWorkouts.map((workout) => (
            <Card key={workout.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {workout.type}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {formatDuration(workout.durationMinutes)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>📅 {formatDate(workout.date)}</span>
                    {workout.exerciseCount > 0 && (
                      <span>💪 {workout.exerciseCount} exercise{workout.exerciseCount !== 1 ? 's' : ''}</span>
                    )}
                    {workout.reps && (
                      <span>🔄 {workout.reps} total reps</span>
                    )}
                    {workout.weight && (
                      <span>⚖️ {workout.weight} lbs</span>
                    )}
                  </div>

                  {workout.notes && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {workout.notes}
                    </p>
                  )}

                  {workout.exerciseCount > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        💪 {workout.exerciseCount} exercise{workout.exerciseCount !== 1 ? 's' : ''} logged
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {onEditWorkout && (
                    <Button
                      onClick={() => onEditWorkout(workout)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                  )}
                  {onDeleteWorkout && (
                    <Button
                      onClick={() => handleDelete(workout.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredAndSortedWorkouts.length > 0 && (
        <Card className="p-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedWorkouts.length} of {workouts.length} workouts
            {filterType && ` matching "${filterType}"`}
          </div>
        </Card>
      )}
    </div>
  );
}
