'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { workoutTemplateService, WorkoutTemplateDetail } from '@/lib/api/workoutService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface LoggedSet {
  setId: string;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

interface LoggedExercise {
  exerciseId: number;
  exerciseName: string;
  sets: LoggedSet[];
}

interface WorkoutLog {
  templateId: number;
  templateName: string;
  startTime: Date;
  endTime?: Date;
  exercises: LoggedExercise[];
  notes?: string;
}

export default function WorkoutLogPage() {
  const params = useParams();
  const router = useRouter();
  const workoutId = parseInt(params.id as string);
  
  const [template, setTemplate] = useState<WorkoutTemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentExercise, setCurrentExercise] = useState<number>(0);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workoutTemplateService.getWorkoutTemplateById(workoutId);
      setTemplate(data);
      
      // Initialize workout log
      const initialLog: WorkoutLog = {
        templateId: data.id,
        templateName: data.name,
        startTime: new Date(),
        exercises: data.sections.flatMap(section => 
          section.exercises.map(exercise => ({
            exerciseId: exercise.exercise.id,
            exerciseName: exercise.exercise.name,
            sets: []
          }))
        )
      };
      setWorkoutLog(initialLog);
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

  const addSet = (exerciseId: number) => {
    if (!workoutLog) return;

    const newSet: LoggedSet = {
      setId: `set_${Date.now()}_${Math.random()}`,
      reps: 0,
      weight: 0,
      duration: 0,
      notes: ''
    };

    setWorkoutLog(prev => ({
      ...prev!,
      exercises: prev!.exercises.map(ex => 
        ex.exerciseId === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    }));
  };

  const updateSet = (exerciseId: number, setId: string, field: keyof LoggedSet, value: any) => {
    if (!workoutLog) return;

    setWorkoutLog(prev => ({
      ...prev!,
      exercises: prev!.exercises.map(ex => 
        ex.exerciseId === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.setId === setId 
                  ? { ...set, [field]: value }
                  : set
              )
            }
          : ex
      )
    }));
  };

  const removeSet = (exerciseId: number, setId: string) => {
    if (!workoutLog) return;

    setWorkoutLog(prev => ({
      ...prev!,
      exercises: prev!.exercises.map(ex => 
        ex.exerciseId === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.setId !== setId) }
          : ex
      )
    }));
  };

  const saveWorkout = async () => {
    if (!workoutLog) return;

    try {
      // TODO: Implement API call to save workout
      console.log('Saving workout:', workoutLog);
      alert('Workout saved successfully! (Feature coming soon)');
      
      // Navigate back to workout details
      router.push(`/workouts/${workoutId}`);
    } catch (err) {
      console.error('Failed to save workout:', err);
      alert('Failed to save workout. Please try again.');
    }
  };

  const getCurrentExercise = () => {
    if (!template || !workoutLog) return null;
    
    const allExercises = template.sections.flatMap(section => section.exercises);
    const loggedExercise = workoutLog.exercises[currentExercise];
    
    if (!loggedExercise) return null;
    
    return {
      templateExercise: allExercises.find(ex => ex.exercise.id === loggedExercise.exerciseId),
      loggedExercise
    };
  };

  const nextExercise = () => {
    if (!template) return;
    
    const totalExercises = template.sections.reduce((sum, section) => sum + section.exercises.length, 0);
    
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(prev => prev + 1);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    return `${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="p-6">
              <div className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Loading workout...</span>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !template || !workoutLog) {
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

  const currentExerciseData = getCurrentExercise();
  const totalExercises = template.sections.reduce((sum, section) => sum + section.exercises.length, 0);

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Logging: {template.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Exercise {currentExercise + 1} of {totalExercises}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExercise + 1) / totalExercises) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Exercise */}
          {currentExerciseData && (
            <Card className="mb-6">
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {currentExerciseData.templateExercise?.exercise.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {currentExerciseData.templateExercise?.exercise.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Target Sets:</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {currentExerciseData.templateExercise?.sets}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Target Reps:</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {currentExerciseData.templateExercise?.reps}
                        </span>
                      </div>
                      {currentExerciseData.templateExercise?.weight && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Weight:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {currentExerciseData.templateExercise.weight}lbs
                          </span>
                        </div>
                      )}
                      {currentExerciseData.templateExercise?.duration && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {currentExerciseData.templateExercise.duration}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Tips */}
                {currentExerciseData.templateExercise?.exercise.formTips && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Form Tips:
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {currentExerciseData.templateExercise.exercise.formTips}
                    </p>
                  </div>
                )}

                {/* Sets Logging */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Logged Sets ({currentExerciseData.loggedExercise.sets.length})
                    </h3>
                    <Button
                      onClick={() => addSet(currentExerciseData.loggedExercise.exerciseId)}
                      size="sm"
                    >
                      + Add Set
                    </Button>
                  </div>

                  {currentExerciseData.loggedExercise.sets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No sets logged yet. Click "Add Set" to start logging your performance.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentExerciseData.loggedExercise.sets.map((set, index) => (
                        <div key={set.setId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              Set {index + 1}
                            </h4>
                            <Button
                              onClick={() => removeSet(currentExerciseData.loggedExercise.exerciseId, set.setId)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reps
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={set.reps}
                                onChange={(e) => updateSet(
                                  currentExerciseData.loggedExercise.exerciseId, 
                                  set.setId, 
                                  'reps', 
                                  parseInt(e.target.value) || 0
                                )}
                                className="w-full px-3 py-3 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            {currentExerciseData.templateExercise?.weight && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Weight (lbs)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={set.weight || ''}
                                  onChange={(e) => updateSet(
                                    currentExerciseData.loggedExercise.exerciseId, 
                                    set.setId, 
                                    'weight', 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="w-full px-3 py-3 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            )}

                            {currentExerciseData.templateExercise?.duration && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Duration (seconds)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={set.duration || ''}
                                  onChange={(e) => updateSet(
                                    currentExerciseData.loggedExercise.exerciseId, 
                                    set.setId, 
                                    'duration', 
                                    parseInt(e.target.value) || 0
                                  )}
                                  className="w-full px-3 py-3 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            )}
                          </div>

                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Notes (optional)
                            </label>
                            <textarea
                              value={set.notes || ''}
                              onChange={(e) => updateSet(
                                currentExerciseData.loggedExercise.exerciseId, 
                                set.setId, 
                                'notes', 
                                e.target.value
                              )}
                              placeholder="Add any notes about this set..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              onClick={previousExercise}
              disabled={currentExercise === 0}
              variant="outline"
              className="w-full sm:w-auto"
            >
              ← Previous Exercise
            </Button>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={() => router.push(`/workouts/${workoutId}`)}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={saveWorkout}
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              >
                Save Workout
              </Button>
            </div>

            <Button
              onClick={nextExercise}
              disabled={currentExercise >= totalExercises - 1}
              className="w-full sm:w-auto"
            >
              Next Exercise →
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
