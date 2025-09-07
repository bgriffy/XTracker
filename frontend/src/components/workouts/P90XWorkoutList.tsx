'use client';

import { useState, useEffect } from 'react';
import { workoutTemplateService, WorkoutTemplate } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { WorkoutSummary } from './WorkoutSummary';
import { WorkoutFilters } from './WorkoutFilters';
import { WorkoutTemplatesGrid } from './WorkoutTemplatesGrid';

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
      <WorkoutFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterDifficulty={filterDifficulty}
        onDifficultyChange={setFilterDifficulty}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onRefresh={loadTemplates}
      />

      {/* Workout Templates Grid */}
      <WorkoutTemplatesGrid
        templates={filteredAndSortedTemplates}
        onStartWorkout={onStartWorkout}
        onViewDetails={onViewDetails}
        hasFilters={!!(searchTerm || filterCategory || filterDifficulty)}
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        filterDifficulty={filterDifficulty}
      />

      {/* Summary */}
      <WorkoutSummary
        filteredCount={filteredAndSortedTemplates.length}
        totalCount={templates.length}
        hasFilters={!!(searchTerm || filterCategory || filterDifficulty)}
        workoutType="P90X workouts"
      />
    </div>
  );
}
