'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { workoutTemplateService, WorkoutTemplateDetail } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workoutId = parseInt(params.id as string);
  
  const [template, setTemplate] = useState<WorkoutTemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutTemplateService.getWorkoutTemplateById(workoutId);
      setTemplate(data);
      // Expand first section by default
      if (data.sections.length > 0) {
        setExpandedSections(new Set([data.sections[0].id]));
      }
    } catch (err) {
      console.error('Failed to load workout template:', err);
      setError('Failed to load workout details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workoutId) {
      loadTemplate();
    }
  }, [workoutId]);

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleStartWorkout = () => {
    router.push(`/workouts/${workoutId}/log`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    return `${remainingSeconds}s`;
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
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="p-6">
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Loading workout details...</span>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !template) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="p-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || 'Workout not found'}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={loadTemplate} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={() => router.back()} variant="outline">
                    Go Back
                  </Button>
                </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
              >
                ← Back
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {template.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Workout Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {template.estimatedDurationMinutes}m
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {template.exerciseCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Exercises</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {template.sectionCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sections</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {template.difficulty}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
              </Card>
            </div>

            {/* Workout Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Category & Difficulty
                </h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Equipment Needed
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {template.equipment}
                </p>
              </Card>
            </div>

            {/* Instructions */}
            {template.instructions && (
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Instructions
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {template.instructions}
                </p>
              </Card>
            )}
          </div>

          {/* Workout Sections */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Workout Sections
            </h2>
            
            {template.sections.map((section) => (
              <Card key={section.id} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {section.name}
                      </h3>
                      {section.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {section.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Type: {section.type}</span>
                        <span>Exercises: {section.exercises.length}</span>
                        {section.restPeriodSeconds > 0 && (
                          <span>Rest: {formatDuration(section.restPeriodSeconds)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {expandedSections.has(section.id) ? '▼' : '▶'}
                    </div>
                  </div>
                </div>

                {expandedSections.has(section.id) && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {section.instructions && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {section.instructions}
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Exercises
                      </h4>
                      <div className="space-y-3">
                        {section.exercises.map((exercise) => (
                          <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                  {exercise.exercise.name}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {exercise.exercise.description}
                                </p>
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div>Sets: {exercise.sets}</div>
                                <div>Reps: {exercise.reps}</div>
                                {exercise.weight && <div>Weight: {exercise.weight}lbs</div>}
                                {exercise.duration && <div>Duration: {exercise.duration}s</div>}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                  {exercise.exercise.category}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Difficulty:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                  {exercise.exercise.difficulty}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Primary Muscles:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">
                                  {exercise.exercise.primaryMuscleGroups}
                                </span>
                              </div>
                              {exercise.exercise.secondaryMuscleGroups && (
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Secondary Muscles:</span>
                                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                                    {exercise.exercise.secondaryMuscleGroups}
                                  </span>
                                </div>
                              )}
                            </div>

                            {exercise.exercise.formTips && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h6 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                  Form Tips:
                                </h6>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  {exercise.exercise.formTips}
                                </p>
                              </div>
                            )}

                            {exercise.exercise.videoUrl && (
                              <div className="mt-3">
                                <a
                                  href={exercise.exercise.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  📹 Watch Video Guide
                                </a>
                              </div>
                            )}

                            {exercise.notes && (
                              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <h6 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                                  Notes:
                                </h6>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  {exercise.notes}
                                </p>
                              </div>
                            )}

                            {exercise.restBetweenSetsSeconds && exercise.restBetweenSetsSeconds > 0 && (
                              <div className="mt-2 text-sm text-gray-500">
                                Rest between sets: {formatDuration(exercise.restBetweenSetsSeconds)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 justify-center">
            <Button
              onClick={handleStartWorkout}
              size="lg"
              className="px-8"
            >
              Start Logging Workout
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Back to Workouts
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
