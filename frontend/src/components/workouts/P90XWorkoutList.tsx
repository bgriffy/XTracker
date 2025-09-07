'use client';

import { useState, useEffect } from 'react';
import { workoutTemplateService, WorkoutTemplate } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface P90XWorkoutListProps {
  onStartWorkout?: (template: WorkoutTemplate) => void;
  onViewDetails?: (template: WorkoutTemplate) => void;
}

export function P90XWorkoutList({ onStartWorkout, onViewDetails }: P90XWorkoutListProps) {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'duration' | 'difficulty' | 'exerciseCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutTemplateService.getP90XWorkoutTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load P90X workout templates:', err);
      setError('Failed to load P90X workout templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const filteredAndSortedTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === '' || template.category.toLowerCase() === filterCategory.toLowerCase();
      const matchesDifficulty = filterDifficulty === '' || template.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'duration':
          comparison = a.estimatedDurationMinutes - b.estimatedDurationMinutes;
          break;
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          comparison = (difficultyOrder[a.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 0) - 
                      (difficultyOrder[b.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 0);
          break;
        case 'exerciseCount':
          comparison = a.exerciseCount - b.exerciseCount;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

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
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      default:
        return '💪';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Loading P90X workouts...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadTemplates} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          P90X Workout Library
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose from {templates.length} authentic P90X workouts
        </p>
      </div>

      {/* Filters and Controls */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search workouts
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="resistance">Resistance</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="plyometrics">Plyometrics</option>
              <option value="martial arts">Martial Arts</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label htmlFor="filter-difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              id="filter-difficulty"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'duration' | 'difficulty' | 'exerciseCount')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="duration">Duration</option>
              <option value="difficulty">Difficulty</option>
              <option value="exerciseCount">Exercise Count</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="sort-order" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Order:
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <Button onClick={loadTemplates} variant="outline" size="sm" className="w-full sm:w-auto">
            Refresh
          </Button>
        </div>
      </Card>

      {/* Workout Templates Grid */}
      {filteredAndSortedTemplates.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No workouts found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {searchTerm || filterCategory || filterDifficulty ? 'Try adjusting your filters' : 'No P90X workouts available'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAndSortedTemplates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                  {template.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">⏱️</span>
                    <span className="text-gray-700 dark:text-gray-300">{formatDuration(template.estimatedDurationMinutes)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">💪</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.exerciseCount} exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📋</span>
                    <span className="text-gray-700 dark:text-gray-300">{template.sectionCount} sections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🏋️</span>
                    <span className="text-gray-700 dark:text-gray-300 text-xs truncate">{template.equipment}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  {onStartWorkout && (
                    <Button
                      onClick={() => onStartWorkout(template)}
                      className="flex-1"
                      size="sm"
                    >
                      Start Workout
                    </Button>
                  )}
                  {onViewDetails && (
                    <Button
                      onClick={() => onViewDetails(template)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      Details
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredAndSortedTemplates.length > 0 && (
        <Card className="p-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedTemplates.length} of {templates.length} P90X workouts
            {(searchTerm || filterCategory || filterDifficulty) && ' matching your filters'}
          </div>
        </Card>
      )}
    </div>
  );
}
