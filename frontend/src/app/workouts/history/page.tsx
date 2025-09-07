'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { workoutService, Workout } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WorkoutHistoryPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutService.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      console.error('Failed to load workout history:', err);
      setError('Failed to load workout history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const filteredAndSortedWorkouts = workouts
    .filter(workout => {
      const matchesSearch = workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (workout.notes && workout.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === '' || workout.type.toLowerCase() === filterType.toLowerCase();
      
      // Date range filtering
      const workoutDate = new Date(workout.date);
      const now = new Date();
      let matchesDateRange = true;
      
      switch (filterDateRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = workoutDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDateRange = workoutDate >= monthAgo;
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          matchesDateRange = workoutDate >= quarterAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesDateRange = workoutDate >= yearAgo;
          break;
      }
      
      return matchesSearch && matchesType && matchesDateRange;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'duration':
          comparison = a.durationMinutes - b.durationMinutes;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getWorkoutTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'resistance':
        return 'bg-blue-100 text-blue-800';
      case 'cardio':
        return 'bg-red-100 text-red-800';
      case 'flexibility':
        return 'bg-purple-100 text-purple-800';
      case 'plyometrics':
        return 'bg-orange-100 text-orange-800';
      case 'martial arts':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const getWorkoutStats = () => {
    const totalWorkouts = filteredAndSortedWorkouts.length;
    const totalDuration = filteredAndSortedWorkouts.reduce((sum, workout) => sum + workout.durationMinutes, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    
    // Calculate workout frequency (workouts per week)
    const firstWorkout = filteredAndSortedWorkouts[filteredAndSortedWorkouts.length - 1];
    const lastWorkout = filteredAndSortedWorkouts[0];
    let workoutsPerWeek = 0;
    
    if (firstWorkout && lastWorkout) {
      const daysDiff = (new Date(lastWorkout.date).getTime() - new Date(firstWorkout.date).getTime()) / (1000 * 60 * 60 * 24);
      const weeksDiff = Math.max(1, daysDiff / 7);
      workoutsPerWeek = Math.round((totalWorkouts / weeksDiff) * 10) / 10;
    }
    
    return {
      totalWorkouts,
      totalDuration,
      avgDuration,
      workoutsPerWeek
    };
  };

  const stats = getWorkoutStats();

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="p-6">
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Loading workout history...</span>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="p-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadWorkouts} variant="outline">
                  Try Again
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Workout History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your fitness journey and progress over time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalWorkouts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Workouts
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatDuration(stats.totalDuration)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Time
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatDuration(stats.avgDuration)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Duration
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {stats.workoutsPerWeek}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Per Week
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  id="filter-type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="resistance">Resistance</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="plyometrics">Plyometrics</option>
                  <option value="martial arts">Martial Arts</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Range
                </label>
                <select
                  id="filter-date"
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort by
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'type' | 'duration')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="type">Type</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order
                </label>
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Workout List */}
          {filteredAndSortedWorkouts.length === 0 ? (
            <Card className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No workouts found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  {searchTerm || filterType || filterDateRange !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Start logging workouts to see your history here'}
                </p>
                <div className="mt-4">
                  <Button onClick={() => router.push('/p90x')}>
                    Browse P90X Workouts
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedWorkouts.map((workout) => (
                <Card key={workout.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {workout.type}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkoutTypeColor(workout.type)} w-fit`}>
                          {workout.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{formatDate(workout.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>⏱️</span>
                          <span>{formatDuration(workout.durationMinutes)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💪</span>
                          <span>{workout.exerciseCount} exercises</span>
                        </div>
                      </div>

                      {workout.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {workout.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 sm:ml-4">
                      <Button
                        onClick={() => router.push(`/workouts/${workout.id}`)}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Summary */}
          {filteredAndSortedWorkouts.length > 0 && (
            <Card className="p-4 mt-6">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAndSortedWorkouts.length} of {workouts.length} workouts
                {(searchTerm || filterType || filterDateRange !== 'all') && ' matching your filters'}
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
