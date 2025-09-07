'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { workoutService, Exercise, CreateWorkoutRequest } from '@/lib/api/workoutService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Validation schema
const workoutFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.string().min(1, 'Workout type is required').max(100, 'Type must be less than 100 characters'),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute').max(480, 'Duration cannot exceed 8 hours'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  reps: z.number().min(0).max(1000).optional(),
  weight: z.number().min(0).max(1000).optional(),
  exercises: z.array(z.object({
    exerciseId: z.number().min(1, 'Exercise is required'),
    sets: z.number().min(1, 'Sets must be at least 1').max(50, 'Sets cannot exceed 50'),
    reps: z.number().min(1, 'Reps must be at least 1').max(1000, 'Reps cannot exceed 1000'),
    weight: z.number().min(0).max(1000).optional(),
    duration: z.number().min(1).max(300).optional(),
    notes: z.string().max(500, 'Exercise notes must be less than 500 characters').optional(),
  })).optional(),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;

interface WorkoutFormProps {
  onSubmit: (data: CreateWorkoutRequest) => Promise<void>;
  initialData?: Partial<WorkoutFormData>;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function WorkoutForm({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  submitButtonText = 'Create Workout' 
}: WorkoutFormProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Today's date
      type: '',
      durationMinutes: 30,
      notes: '',
      exercises: [],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  // Load exercises on component mount
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoadingExercises(true);
        // For now, we'll use mock data since exercise endpoints don't exist yet
        const mockExercises: Exercise[] = [
          { id: 1, name: 'Push-ups', category: 'Bodyweight', description: 'Classic push-up exercise', createdAt: new Date().toISOString() },
          { id: 2, name: 'Squats', category: 'Bodyweight', description: 'Bodyweight squat exercise', createdAt: new Date().toISOString() },
          { id: 3, name: 'Bench Press', category: 'Strength', description: 'Barbell bench press', createdAt: new Date().toISOString() },
          { id: 4, name: 'Deadlift', category: 'Strength', description: 'Barbell deadlift', createdAt: new Date().toISOString() },
          { id: 5, name: 'Pull-ups', category: 'Bodyweight', description: 'Pull-up exercise', createdAt: new Date().toISOString() },
          { id: 6, name: 'Running', category: 'Cardio', description: 'Running or jogging', createdAt: new Date().toISOString() },
          { id: 7, name: 'Plank', category: 'Core', description: 'Plank hold exercise', createdAt: new Date().toISOString() },
          { id: 8, name: 'Burpees', category: 'HIIT', description: 'Full body burpee exercise', createdAt: new Date().toISOString() },
        ];
        setExercises(mockExercises);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      } finally {
        setLoadingExercises(false);
      }
    };

    loadExercises();
  }, []);

  const onFormSubmit = async (data: WorkoutFormData) => {
    try {
      await onSubmit(data as CreateWorkoutRequest);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addExercise = () => {
    append({
      exerciseId: 0,
      sets: 1,
      reps: 10,
      weight: undefined,
      duration: undefined,
      notes: '',
    });
  };

  const removeExercise = (index: number) => {
    remove(index);
  };

  if (loadingExercises) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Loading exercises...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Workout Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              {...register('date')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Workout Type *
            </label>
            <input
              type="text"
              id="type"
              placeholder="e.g., Chest & Triceps, Cardio, Full Body"
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="durationMinutes"
              min="1"
              max="480"
              {...register('durationMinutes', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.durationMinutes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.durationMinutes.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="reps" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Total Reps
            </label>
            <input
              type="number"
              id="reps"
              min="0"
              max="1000"
              {...register('reps', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.reps && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reps.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Weight (lbs)
            </label>
            <input
              type="number"
              id="weight"
              min="0"
              max="1000"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.weight.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Add any notes about your workout..."
            {...register('notes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes.message}</p>
          )}
        </div>

        {/* Exercises Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Exercises</h3>
            <Button
              type="button"
              onClick={addExercise}
              variant="outline"
              size="sm"
            >
              Add Exercise
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <p className="text-base">No exercises added yet.</p>
              <p className="text-sm mt-1">Click "Add Exercise" to start tracking specific exercises.</p>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Exercise {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeExercise(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Exercise *
                    </label>
                    <select
                      {...register(`exercises.${index}.exerciseId`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={0}>Select an exercise</option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name} ({exercise.category})
                        </option>
                      ))}
                    </select>
                    {errors.exercises?.[index]?.exerciseId && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.exercises[index]?.exerciseId?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Sets *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.exercises?.[index]?.sets && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.exercises[index]?.sets?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Reps *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.exercises?.[index]?.reps && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.exercises[index]?.reps?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="0.1"
                      {...register(`exercises.${index}.weight`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.exercises?.[index]?.weight && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.exercises[index]?.weight?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      {...register(`exercises.${index}.duration`, { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.exercises?.[index]?.duration && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.exercises[index]?.duration?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Exercise Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., felt strong, form was good"
                      {...register(`exercises.${index}.notes`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.exercises?.[index]?.notes && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.exercises[index]?.notes?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="min-w-[120px]"
          >
            {isSubmitting || isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
